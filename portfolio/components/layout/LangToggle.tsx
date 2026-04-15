'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function LangToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'zh-TW' ? 'en' : 'zh-TW' });
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="text-xs h-8 px-2">
      {locale === 'zh-TW' ? 'EN' : '中文'}
    </Button>
  );
}
