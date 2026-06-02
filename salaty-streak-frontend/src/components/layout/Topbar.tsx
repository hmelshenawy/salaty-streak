'use client';

import { useAuth } from '@/hooks/useAuth';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="hidden md:flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
      </div>
    </header>
  );
}