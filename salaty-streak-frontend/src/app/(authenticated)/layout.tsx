import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MilestoneCelebration } from '@/components/streaks/MilestoneCelebration';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop topbar */}
        <Topbar />

        {/* Main content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-auto px-4 py-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Milestone celebration popup (listens across all pages) */}
      <MilestoneCelebration />
    </div>
  );
}