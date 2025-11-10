'use server';

import { detectNetworkAnomaly, type DetectNetworkAnomalyInput, type DetectNetworkAnomalyOutput } from '@/ai/flows/adaptive-anomaly-detection';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function addAnomaly(anomaly: DetectNetworkAnomalyOutput) {
  try {
    await addDoc(collection(db, 'anomalies'), {
      ...anomaly,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

export async function getAnomalyDetection(
  prevState: any,
  formData: FormData
) {
  const networkTrafficData = formData.get('networkTrafficData') as string;
  const useBaseline = formData.get('useBaseline') === 'on';
  const baselineNetworkBehavior = formData.get('baselineNetworkBehavior') as string;

  const input: DetectNetworkAnomalyInput = {
    networkTrafficData,
    ...(useBaseline && { baselineNetworkBehavior }),
  };

  if (!networkTrafficData) {
    return { data: null, error: 'Network traffic data is required.' };
  }
  
  try {
    const result = await detectNetworkAnomaly(input);
    if (result.anomalyDetected) {
      await addAnomaly(result);
    }
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to detect anomaly: ${errorMessage}` };
  }
}
