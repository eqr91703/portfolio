import { Badge } from '@/components/ui/badge';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  bullets: string[];
}

export function TimelineItem({ title, subtitle, period, bullets }: TimelineItemProps) {
  return (
    <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-border last:before:hidden">
      {/* 時間軸圓點 */}
      <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary" />

      <div className="flex flex-col gap-1 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-base shrink-0">
            {period}
          </Badge>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="text-base text-muted-foreground leading-relaxed flex gap-2">
              <span className="mt-2.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
