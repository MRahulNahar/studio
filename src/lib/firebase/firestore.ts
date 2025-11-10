
'use server';

import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { DetectNetworkAnomalyOutput } from '@/ai/flows/adaptive-anomaly-detection';

export async function addAnomaly(anomalyData: DetectNetworkAnomalyOutput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'anomalies'), {
      ...anomalyData,
      timestamp: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add anomaly to database.');
  }
}
