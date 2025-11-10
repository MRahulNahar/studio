'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, AlertTriangle, ShieldX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Alert } from '@/lib/types';
import { initialAlerts } from '@/lib/mock-data';

const severityIcons: Record<Alert['severity'], React.ReactNode> = {
  info: <Info className="h-5 w-5 text-sky-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  critical: <ShieldX className="h-5 w-5 text-red-500" />,
};

const severityColors: Record<Alert['severity'], string> = {
  info: 'border-l-sky-500',
  warning: 'border-l-yellow-500',
  critical: 'border-l-red-500',
};

const possibleMessages: { message: string, severity: Alert['severity']}[] = [
    { message: "New device connected from unexpected IP range.", severity: 'info'},
    { message: "High number of DNS queries for non-existent domains.", severity: 'warning'},
    { message: "Potential TCP SYN flood attack detected.", severity: 'critical'},
    { message: "Malformed packet detected in flow.", severity: 'warning'},
    { message: "Connection timeout anomaly.", severity: 'info'},
];

export function AlertsPanel() {
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);

  React.useEffect(() => {
    const interval = setInterval(() => {
        const randomMsg = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
        const newAlert: Alert = {
            id: `alert_${Date.now()}`,
            timestamp: new Date(),
            severity: randomMsg.severity,
            message: `${randomMsg.message} (flow_${Math.floor(Math.random() * 20)})`,
            flowId: `flow_${Math.floor(Math.random() * 20)}`
        };
      setAlerts(prev => [newAlert, ...prev].slice(0, 20));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Panel</CardTitle>
        <CardDescription>Protocol violations and anomalies.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] w-full">
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <div className={`flex items-start gap-4 p-3 border-l-4 ${severityColors[alert.severity]}`}>
                  <div className="mt-1">{severityIcons[alert.severity]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {index < alerts.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
