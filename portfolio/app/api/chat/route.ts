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

  let message: string;
  try {
    const body = await req.json();
    message = String(body.message ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const portfolioContent = getPortfolioContent();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: `你是王之豪的個人 AI 助理，負責向 HR 與技術面試官介紹他的背景。
請根據以下 Portfolio 內容回答問題，保持簡潔專業。
若問題超出 Portfolio 範圍，請如實說明你不清楚。
請以繁體中文回答，除非對方以英文提問。

--- Portfolio 內容 ---
${portfolioContent}`,
          messages: [{ role: 'user', content: message }],
        });

        for await (const chunk of response) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        console.error('Stream error:', err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
