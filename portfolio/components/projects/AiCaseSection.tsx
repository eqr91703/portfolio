import { AiCaseCard } from './AiCaseCard';
import type { AiCaseEntry } from '@/lib/content';

interface AiCaseSectionProps {
  title: string;
  description: string;
  cases: AiCaseEntry[];
}

export function AiCaseSection({ title, description, cases }: AiCaseSectionProps) {
  if (cases.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cases.map((entry) => (
          <AiCaseCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
