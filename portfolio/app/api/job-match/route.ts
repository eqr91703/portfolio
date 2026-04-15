import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { checkRateLimit } from '@/lib/rateLimit';

function getPortfolioContent(): string {
  try {
    return readFileSync(join(process.cwd(), 'public', 'portfolio.md'), 'utf-8');
  } catch {
    return '';
  }
}

export interface JobMatchResult {
  score: number;
  matched: string[];
  gaps: string[];
  suggestions: string[];
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: '請求過於頻繁，請稍後再試。（Rate limit exceeded）' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Invalid Content-Type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let jd: string;
  try {
    const body = await req.json();
    jd = String(body.jd ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!jd) {
    return new Response(JSON.stringify({ error: 'jd is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const portfolioContent = getPortfolioContent();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `請根據以下 Portfolio 與職缺 JD，分析候選人的匹配程度。

--- Portfolio ---
${portfolioContent}

--- 職缺 JD ---
${jd}

請嚴格以 JSON 格式回覆，不要包含任何說明文字，格式如下：
{
  "score": <0 到 100 的整數，代表整體匹配分數>,
  "matched": [<最多 5 個已符合的技能或經驗，用繁體中文簡短描述>],
  "gaps": [<最多 3 個主要差距，用繁體中文簡短描述>],
  "suggestions": [<最多 3 個補強建議，用繁體中文簡短描述>]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result: JobMatchResult = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Job match error:', err);
    return new Response(JSON.stringify({ error: '分析失敗，請稍後再試。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
