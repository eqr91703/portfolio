import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { TimelineItem } from '@/components/cv/TimelineItem';
import { getExperience, getSkills, getEducation } from '@/lib/content';
import { Download, Award, Briefcase, Code2, GraduationCap, ExternalLink } from 'lucide-react';
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

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
        {icon}
      </span>
      {children}
    </h2>
  );
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
        <div className="flex gap-2">
          <a
            href="/api/download-pdf"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('downloadPdf')}
          </a>
          <a
            href="/api/download-portfolio"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('downloadMd')}
          </a>
        </div>
      </div>

      {/* 工作經歷 */}
      <section>
        <SectionHeading icon={<Briefcase className="h-4 w-4 text-primary" />}>
          {t('experience')}
        </SectionHeading>
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
        <SectionHeading icon={<Code2 className="h-4 w-4 text-primary" />}>
          {t('skills')}
        </SectionHeading>
        <div className="flex flex-col gap-5">
          {skills.categories.map((cat) => (
            <div key={cat.name} className="border-l-2 border-primary/30 pl-4">
              <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {cat.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-150 cursor-default"
                  >
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
          <SectionHeading icon={<Award className="h-4 w-4 text-primary" />}>
            {t('certifications')}
          </SectionHeading>
          <div className="flex flex-col gap-3">
            {skills.certifications.map((cert) => {
              const inner = (
                <>
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  {cert.url && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </>
              );
              return cert.url ? (
                <a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-muted/50 hover:border-primary/30 transition-colors duration-150"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={cert.name}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Separator />

      {/* 學歷 */}
      <section>
        <SectionHeading icon={<GraduationCap className="h-4 w-4 text-primary" />}>
          {t('education')}
        </SectionHeading>
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
