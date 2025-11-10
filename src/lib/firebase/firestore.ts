
'use server';

import { db } from './config';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { DetectNetworkAnomalyOutput } from '@/ai/flows/adaptive-anomaly-detection';
import type { Alert } from '@/lib/types';

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

export function getAnomalies(callback: (anomalies: Alert[]) => void) {
  const q = query(collection(db, 'anomalies'), orderBy('timestamp', 'desc'), limit(20));
  
  return onSnapshot(q, (querySnapshot) => {
    const alerts: Alert[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      alerts.push({
        id: doc.id,
        timestamp: data.timestamp?.toDate() || new Date(),
        severity: data.anomalyDetected ? 'warning' : 'info',
        message: data.anomalyDescription,
      });
    });
    callback(alerts);
  }, (error) => {
    console.error("Error fetching anomalies: ", error);
  });
}
