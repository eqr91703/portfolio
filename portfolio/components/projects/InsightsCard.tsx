import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function InsightsCard() {
  const t = useTranslations('projects');

  return (
    <div className="rounded-xl border bg-gradient-to-br from-muted/50 to-muted/20 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* Claude logo mark */}
          <svg className="h-4 w-4 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span className="text-sm font-semibold">{t('insightsTitle')}</span>
        </div>
        <p className="text-xs text-muted-foreground">{t('insightsStats')}</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          {t('insightsDesc')}
        </p>
      </div>
      <a
        href="/claude-code-insights.html"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
        {t('insightsViewReport')}
      </a>
    </div>
  );
}
