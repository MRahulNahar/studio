import { AnomalyDetection } from '@/components/anomaly-detection';
import { AppSidebar } from '@/components/app-sidebar';
import { AlertsPanel } from '@/components/alerts-panel';
import { DashboardHeader } from '@/components/dashboard-header';
import { LiveFlowsTable } from '@/components/live-flows-table';
import { ProtocolDistributionChart } from '@/components/protocol-distribution-chart';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="p-4 lg:p-6 grid gap-6 grid-cols-1 xl:grid-cols-3 xl:grid-rows-3 min-h-[calc(100vh-4rem)]">
          <div className="xl:col-span-3 xl:row-span-2">
            <LiveFlowsTable />
          </div>
          <div className="xl:col-span-2 xl:row-span-1">
            <AnomalyDetection />
          </div>
          <div className="xl:col-span-1 xl:row-span-1 grid gap-6 content-start">
            <ProtocolDistributionChart />
            <AlertsPanel />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
