import { AnomalyDetection } from '@/components/anomaly-detection';
import { AlertsPanel } from '@/components/alerts-panel';
import { DashboardHeader } from '@/components/dashboard-header';
import { LiveFlowsTable } from '@/components/live-flows-table';
import { ProtocolDistributionChart } from '@/components/protocol-distribution-chart';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="p-4 lg:p-6 grid gap-6 grid-cols-1 xl:grid-cols-3 min-h-[calc(100vh-4rem)]">
        <div className="xl:col-span-2">
          <LiveFlowsTable />
        </div>
        <div className="xl:col-span-1">
          <AlertsPanel />
        </div>
        <div className="xl:col-span-2">
            <AnomalyDetection />
        </div>
        <div className="xl:col-span-1">
          <ProtocolDistributionChart />
        </div>
      </main>
    </>
  );
}
