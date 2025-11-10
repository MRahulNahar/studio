
'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getAnomalies } from '@/lib/firebase/firestore-client';
import type { Anomaly } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, Siren } from 'lucide-react';
import { Separator } from './ui/separator';

function AnomalyItem({ anomaly }: { anomaly: Anomaly }) {
  const isAttack = anomaly.isGenuineAttack;
  const badgeVariant = isAttack ? 'destructive' : 'default';
  const BadgeIcon = isAttack ? ShieldAlert : ShieldCheck;

  return (
    <div className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <BadgeIcon className={`w-5 h-5 ${isAttack ? 'text-destructive' : 'text-green-600'}`} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">
                {isAttack ? `Attack Detected: ${anomaly.attackClassification}` : 'Benign Anomaly'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(anomaly.timestamp, { addSuffix: true })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{anomaly.anomalyDescription}</p>
          <div className="flex items-center justify-between mt-2 text-xs">
             <Badge variant={badgeVariant}>
                Confidence: {(anomaly.confidenceScore * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsPanel() {
  const [anomalies, setAnomalies] = React.useState<Anomaly[]>([]);

  React.useEffect(() => {
    const unsubscribe = getAnomalies(setAnomalies);
    return () => unsubscribe();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="bg-destructive/10 p-3 rounded-full">
          <Siren className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <CardTitle className="font-headline text-xl">Alerts Panel</CardTitle>
          <CardDescription>
            Live feed of detected network anomalies and potential threats.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-border">
              {anomalies.length > 0 ? (
                anomalies.map((anomaly) => <AnomalyItem key={anomaly.id} anomaly={anomaly} />)
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-muted-foreground">
                  <p>No anomalies detected yet.</p>
                </div>
              )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
