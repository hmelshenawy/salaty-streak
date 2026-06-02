'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Clock, Settings } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/streaks', label: 'Streaks', icon: Flame },
  { href: '/prayers/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden h-16 bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/prayers'
            : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-12 transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-1.5 h-1 w-4 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}