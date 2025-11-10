
'use client';

import { db } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { Alert } from '@/lib/types';

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
