'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Info, ShieldAlert, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/lib/types';
import { initialAlerts } from '@/lib/mock-data';

const severityIcons: Record<Alert['severity'], React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  critical: <ShieldAlert className="h-4 w-4 text-red-500" />,
};

const severityColors: Record<Alert['severity'], string> = {
    info: 'border-blue-500/50',
    warning: 'border-yellow-500/50',
    critical: 'border-red-500/50',
}

export function AlertsPanel() {
  const [alerts] = React.useState<Alert[]>(initialAlerts);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Critical events and warnings from the network.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-4 p-3 rounded-lg border ${severityColors[alert.severity]}`}>
                  <div className="mt-1">{severityIcons[alert.severity]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{alert.message}</p>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </p>
                        {alert.flowId && <Badge variant="secondary">Flow: {alert.flowId}</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <WifiOff className="w-12 h-12 mb-4" />
              <h3 className="font-semibold">No Alerts</h3>
              <p className="text-sm">The network is quiet. No alerts to show right now.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
