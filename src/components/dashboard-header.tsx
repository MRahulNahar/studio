import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold font-headline">Dashboard</h1>
    </header>
  );
}
