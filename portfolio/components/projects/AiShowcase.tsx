'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Send, Loader2 } from 'lucide-react';
import type { JobMatchResult } from '@/app/api/job-match/route';

// ─── Chat Tab ────────────────────────────────────────────────────────────────

function ChatTab() {
  const t = useTranslations('projects');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit() {
    const message = input.trim();
    if (!message || loading) return;

    setLoading(true);
    setResponse('');
    setError('');
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? '發生錯誤，請稍後再試。');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('發生錯誤，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chatPlaceholder')}
        rows={3}
        disabled={loading}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !input.trim()} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {t('chatSubmit')}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {response && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {response}
          {loading && <span className="inline-block w-1.5 h-4 bg-foreground/60 ml-0.5 animate-pulse" />}
        </div>
      )}
    </div>
  );
}

// ─── Job Match Tab ────────────────────────────────────────────────────────────

function JobMatchTab() {
  const t = useTranslations('projects');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const text = jd.trim();
    if (!text || loading) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '分析失敗，請稍後再試。');
        return;
      }
      setResult(data as JobMatchResult);
    } catch {
      setError('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder={t('jobMatchPlaceholder')}
        rows={6}
        disabled={loading}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !jd.trim()} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {t('jobMatchSubmit')}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {result && (
        <div className="flex flex-col gap-5 rounded-lg border bg-muted/40 px-4 py-4">
          {/* Score */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('matchScore')}</span>
              <span className="text-2xl font-bold text-primary">{result.score}</span>
            </div>
            <Progress value={result.score} />
          </div>

          {/* Matched */}
          {result.matched.length > 0 && (
            <ResultSection
              title="符合項目"
              items={result.matched}
              dotColor="bg-green-500"
            />
          )}

          {/* Gaps */}
          {result.gaps.length > 0 && (
            <ResultSection
              title="主要差距"
              items={result.gaps}
              dotColor="bg-amber-500"
            />
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <ResultSection
              title="補強建議"
              items={result.suggestions}
              dotColor="bg-blue-500"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  items,
  dotColor,
}: {
  title: string;
  items: string[];
  dotColor: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-1.5">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AiShowcase() {
  const t = useTranslations('projects');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t('aiShowcaseTitle')}</h2>
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">{t('chatTab')}</TabsTrigger>
          <TabsTrigger value="job-match">{t('jobMatchTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="pt-4">
          <ChatTab />
        </TabsContent>
        <TabsContent value="job-match" className="pt-4">
          <JobMatchTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
