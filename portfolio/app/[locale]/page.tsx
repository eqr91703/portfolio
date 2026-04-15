import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { FileText, Folder, Server, Database, Cloud, Bot } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: `王之豪 | ${t('tagline')}` };
}

const featureCards = [
  { key: 'card1', icon: Server },
  { key: 'card2', icon: Database },
  { key: 'card3', icon: Cloud },
  { key: 'card4', icon: Bot },
] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="text-base text-muted-foreground">{t('greeting')}</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          王之豪
          <span className="block text-2xl font-normal text-muted-foreground mt-1">
            Chih-Hao Wang
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">{t('tagline')}</p>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
          {t('bio')}
        </p>
        <div className="flex gap-3 flex-wrap mt-2">
          <Link href="/cv" className={buttonVariants({ variant: 'default' })}>
            <FileText className="h-4 w-4 mr-2" />
            {t('ctaCv')}
          </Link>
          <Link href="/projects" className={buttonVariants({ variant: 'outline' })}>
            <Folder className="h-4 w-4 mr-2" />
            {t('ctaProjects')}
          </Link>
        </div>
      </section>

      {/* 核心能力卡片 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('featuredTitle')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featureCards.map(({ key, icon: Icon }) => (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Icon className="h-4 w-4 text-primary" />
                  {t(`${key}Title` as Parameters<typeof t>[0])}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}Desc` as Parameters<typeof t>[0])}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
