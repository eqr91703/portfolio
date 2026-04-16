import { getTranslations } from 'next-intl/server';
import { getAiCases } from '@/lib/content';
import { AiCaseSection } from '@/components/projects/AiCaseSection';
import { InsightsCard } from '@/components/projects/InsightsCard';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: `王之豪 | ${t('title')}` };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cases = getAiCases(locale as Locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  const promptCases = cases.filter((c) => c.category === 'prompt');
  const agentCases = cases.filter((c) => c.category === 'agent');
  const toolingCases = cases.filter((c) => c.category === 'tooling');

  return (
    <div className="flex flex-col gap-10">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-base text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Claude Code Insights 摘要卡片 */}
      <InsightsCard />

      {/* Prompt Engineering */}
      <AiCaseSection
        title={t('categoryPrompt')}
        description={t('categoryPromptDesc')}
        cases={promptCases}
      />

      {/* Agent / Workflow */}
      <AiCaseSection
        title={t('categoryAgent')}
        description={t('categoryAgentDesc')}
        cases={agentCases}
      />

      {/* 工具整合實例 */}
      <AiCaseSection
        title={t('categoryTooling')}
        description={t('categoryToolingDesc')}
        cases={toolingCases}
      />
    </div>
  );
}
