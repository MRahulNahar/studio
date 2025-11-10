import { AnomalyDetectionClient } from './anomaly-detection-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export function AnomalyDetection() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="font-headline text-xl">Adaptive Anomaly Detection</CardTitle>
          <CardDescription>
            Use AI to analyze network traffic and detect behavioral anomalies. Paste traffic logs to begin.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <AnomalyDetectionClient />
      </CardContent>
    </Card>
  );
}
