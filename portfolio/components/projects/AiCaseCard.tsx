import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import type { AiCaseEntry } from '@/lib/content';

interface AiCaseCardProps {
  entry: AiCaseEntry;
}

export function AiCaseCard({ entry }: AiCaseCardProps) {
  const t = useTranslations('projects');

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold leading-snug">
          {entry.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {entry.description}
        </p>

        {/* Tools */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t('toolsLabel')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.tools.map((tool) => (
              <Badge key={tool} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </div>

        {/* Outcome */}
        {entry.outcome && (
          <div className="mt-auto pt-2 flex items-start gap-2 rounded-md bg-primary/5 px-3 py-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary mb-0.5">
                {t('outcomeLabel')}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {entry.outcome}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
