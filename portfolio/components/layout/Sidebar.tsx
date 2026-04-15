import { Separator } from '@/components/ui/separator';
import { ProfileCard } from './ProfileCard';
import { SidebarNav } from './SidebarNav';
import { ThemeToggle } from './ThemeToggle';
import { LangToggle } from './LangToggle';
import type { Profile } from '@/lib/content';

export function Sidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="flex h-full w-full flex-col gap-5 px-5 py-8">
      <ProfileCard profile={profile} />
      <Separator />
      <SidebarNav />
      <div className="mt-auto flex items-center justify-center gap-1">
        <ThemeToggle />
        <LangToggle />
      </div>
    </aside>
  );
}
