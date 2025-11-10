'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getAnomalyDetection } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Bot, CheckCircle, Loader2 } from 'lucide-react';
import { defaultTrafficData } from '@/lib/mock-data';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Analyze Traffic
    </Button>
  );
}

const initialState = {
  data: null,
  error: null,
};

export function AnomalyDetectionClient() {
  const [state, formAction] = useActionState(getAnomalyDetection, initialState);
  const [useBaseline, setUseBaseline] = React.useState(false);

  const confidenceValue = state.data?.confidenceScore ? state.data.confidenceScore * 100 : 0;
  const isAnomaly = state.data?.anomalyDetected;
  
  return (
    <div className="flex-grow flex flex-col justify-between">
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="networkTrafficData">Network Traffic Data</Label>
          <Textarea
            id="networkTrafficData"
            name="networkTrafficData"
            placeholder="Paste network traffic logs here..."
            className="font-code text-xs h-32"
            required
            defaultValue={defaultTrafficData}
          />
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox id="useBaseline" name="useBaseline" checked={useBaseline} onCheckedChange={(checked) => setUseBaseline(checked as boolean)} />
            <Label htmlFor="useBaseline">Provide baseline network behavior</Label>
        </div>
        {useBaseline && (
            <div>
                <Label htmlFor="baselineNetworkBehavior">Baseline Network Behavior</Label>
                <Textarea
                    id="baselineNetworkBehavior"
                    name="baselineNetworkBehavior"
                    placeholder="Paste baseline behavior data here..."
                    className="font-code text-xs"
                />
            </div>
        )}
        <SubmitButton />
      </form>
      
      {state.error && (
        <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <div className="mt-4 space-y-4">
            <Alert variant={isAnomaly ? "destructive" : "default"} className={!isAnomaly ? 'border-green-500' : ''}>
                {isAnomaly ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                <AlertTitle>{isAnomaly ? "Anomaly Detected" : "No Anomaly Detected"}</AlertTitle>
                <AlertDescription>
                    {state.data.anomalyDescription}
                </AlertDescription>
            </Alert>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="confidence">Confidence Score</Label>
                    <span className="text-sm font-medium">{confidenceValue.toFixed(0)}%</span>
                </div>
                <Progress id="confidence" value={confidenceValue} className="h-2" />
            </div>
        </div>
      )}
    </div>
  );
}
