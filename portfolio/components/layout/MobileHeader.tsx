'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import type { Profile } from '@/lib/content';

export function MobileHeader({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
      <span className="text-sm font-semibold">{profile.name}</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open menu" />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar profile={profile} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
