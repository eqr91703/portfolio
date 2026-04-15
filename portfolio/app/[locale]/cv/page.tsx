import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { TimelineItem } from '@/components/cv/TimelineItem';
import { getExperience, getSkills, getEducation } from '@/lib/content';
import { Download, Award } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cv' });
  return { title: `王之豪 | ${t('title')}` };
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const experience = getExperience(locale as Locale);
  const skills = getSkills(locale as Locale);
  const education = getEducation(locale as Locale);
  const t = await getTranslations({ locale, namespace: 'cv' });

  return (
    <div className="flex flex-col gap-10">
      {/* 標題列 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <a
          href="/api/download-portfolio"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Download className="h-4 w-4 mr-2" />
          {t('downloadPortfolio')}
        </a>
      </div>

      {/* 工作經歷 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('experience')}</h2>
        <div className="mt-2">
          {experience.map((entry, i) => (
            <TimelineItem
              key={i}
              title={entry.title}
              subtitle={entry.company}
              period={entry.period}
              bullets={entry.highlights}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* 技術能力 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('skills')}</h2>
        <div className="flex flex-col gap-4">
          {skills.categories.map((cat) => (
            <div key={cat.name}>
              <p className="text-lg font-medium text-muted-foreground mb-2">{cat.name}</p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 證照 */}
      {skills.certifications.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('certifications')}</h2>
          <div className="flex flex-col gap-2">
            {skills.certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xl font-medium">{cert.name}</p>
                  <p className="text-lg text-muted-foreground">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Separator />

      {/* 學歷 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('education')}</h2>
        <div className="mt-2">
          {education.map((entry, i) => (
            <TimelineItem
              key={i}
              title={entry.school}
              subtitle={entry.department}
              period={entry.period}
              bullets={[...entry.activities, ...entry.achievements]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
