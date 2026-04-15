import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { getProfile } from '@/lib/content';
import type { Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const profile = getProfile(locale as Locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          {/* 手機版頂部列 */}
          <MobileHeader profile={profile} />

          <div className="flex flex-1">
            {/* 桌機版左側欄 (sticky) */}
            <div className="hidden md:block w-72 shrink-0">
              <div className="sticky top-0 h-screen overflow-y-auto border-r">
                <Sidebar profile={profile} />
              </div>
            </div>

            {/* 主內容區 */}
            <main className="flex-1 min-w-0 px-6 py-8 md:px-10 md:py-10">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
