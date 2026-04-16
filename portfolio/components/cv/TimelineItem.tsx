import { Badge } from '@/components/ui/badge';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  bullets: string[];
}

export function TimelineItem({ title, subtitle, period, bullets }: TimelineItemProps) {
  return (
    <div className="group relative pl-7 before:absolute before:left-[5px] before:top-4 before:h-full before:w-px before:bg-border last:before:hidden">
      {/* 時間軸圓點（帶 ring 效果） */}
      <div className="absolute left-0 top-3 h-[11px] w-[11px] rounded-full border-2 border-primary bg-background ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-200" />

      <div className="flex flex-col gap-1 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-base text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-sm shrink-0">
            {period}
          </Badge>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="text-base text-muted-foreground leading-relaxed flex gap-2">
              <span className="mt-2.5 h-1 w-1 rounded-full bg-primary/40 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
