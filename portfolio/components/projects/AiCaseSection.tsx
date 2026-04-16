import type { ReactNode } from 'react';
import { AiCaseCard } from './AiCaseCard';
import type { AiCaseEntry } from '@/lib/content';

interface AiCaseSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  cases: AiCaseEntry[];
}

export function AiCaseSection({ icon, title, description, cases }: AiCaseSectionProps) {
  if (cases.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
            {icon}
          </span>
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground pl-10">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cases.map((entry) => (
          <AiCaseCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
