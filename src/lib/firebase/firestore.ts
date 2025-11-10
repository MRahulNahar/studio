'use server';

import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { DetectNetworkAnomalyOutput } from '@/ai/flows/adaptive-anomaly-detection';

/**
 * Fetches the most recent anomalies from Firestore.
 * @param count - The number of recent anomalies to fetch.
 * @returns A promise that resolves to an array of recent anomalies.
 */
export async function getRecentAnomalies(count: number = 10): Promise<DetectNetworkAnomalyOutput[]> {
  try {
    const q = query(
      collection(db, 'anomalies'),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    const anomalies: DetectNetworkAnomalyOutput[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Firestore data needs to be converted to the correct schema type.
      anomalies.push({
        anomalyDetected: data.anomalyDetected,
        anomalyDescription: data.anomalyDescription,
        confidenceScore: data.confidenceScore,
      });
    });
    return anomalies;
  } catch (error) {
    console.error('Error fetching recent anomalies: ', error);
    return []; // Return empty array on error
  }
}
