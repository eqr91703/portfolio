import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import type { AiCaseEntry } from '@/lib/content';

// Inline GitHub SVG (lucide-react v1.8 has no Github icon)
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.071 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
    </svg>
  );
}

interface AiCaseCardProps {
  entry: AiCaseEntry;
}

export function AiCaseCard({ entry }: AiCaseCardProps) {
  const t = useTranslations('projects');

  return (
    <Card className="group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
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
          <div className="flex items-start gap-2 rounded-md bg-primary/5 px-3 py-2">
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

        {/* GitHub link */}
        {entry.github && (
          <div className="mt-auto pt-1">
            <a
              href={entry.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              <GitHubIcon className="h-3.5 w-3.5 mr-1.5" />
              SKILL.md
              <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
