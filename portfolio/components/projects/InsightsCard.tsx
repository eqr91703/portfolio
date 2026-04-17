import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function InsightsCard() {
  const t = useTranslations('projects');

  const strengths = [
    t('insightsStrength1'),
    t('insightsStrength2'),
    t('insightsStrength3'),
  ];

  return (
    <div className="rounded-xl border bg-gradient-to-br from-muted/50 to-muted/20 px-5 py-4 flex flex-col gap-4">
      {/* 標題列 + 按鈕 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
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
          className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' shrink-0 mt-2 sm:mt-0'}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          {t('insightsViewReport')}
        </a>
      </div>

      {/* 優勢總結 */}
      <div className="border-t border-border/50 pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          {t('insightsStrengthsLabel')}
        </p>
        <ul className="flex flex-col gap-1.5">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary shrink-0 mt-px">✦</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
