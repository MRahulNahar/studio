'use client';

import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { Anomaly } from '@/lib/types';

/**
 * Listens for new anomalies from Firestore in real-time.
 * @param callback - A function to be called with the new list of anomalies.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function getAnomalies(callback: (anomalies: Anomaly[]) => void) {
  const q = query(collection(db, 'anomalies'), orderBy('timestamp', 'desc'), limit(50));
  
  return onSnapshot(q, (querySnapshot) => {
    const anomalies: Anomaly[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      anomalies.push({
        id: doc.id,
        timestamp: data.timestamp?.toDate() || new Date(),
        anomalyDescription: data.anomalyDescription,
        confidenceScore: data.confidenceScore,
        isGenuineAttack: data.isGenuineAttack,
        attackClassification: data.attackClassification,
      });
    });
    callback(anomalies);
  }, (error) => {
    console.error("Error fetching anomalies: ", error);
    callback([]); // Send empty array on error
  });
}
