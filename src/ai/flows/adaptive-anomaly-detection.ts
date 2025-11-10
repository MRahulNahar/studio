
'use server';

/**
 * @fileOverview This file implements the adaptive anomaly detection flow for network traffic analysis.
 *
 * It uses an AI model to learn normal network behavior and identify deviations that could indicate security threats or protocol violations.
 * It also learns from previously detected anomalies to improve its detection capabilities over time.
 *
 * @exports {detectNetworkAnomaly} - The main function to detect network anomalies.
 * @exports {DetectNetworkAnomalyInput} - The input type for the detectNetworkAnomaly function.
 * @exports {DetectNetworkAnomalyOutput} - The output type for the detectNetworkAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getRecentAnomalies } from '@/lib/firebase/firestore';

const DetectNetworkAnomalyInputSchema = z.object({
  networkTrafficData: z
    .string()
    .describe(
      'Network traffic data in a suitable format (e.g., PCAP data converted to string).'
    ),
  baselineNetworkBehavior: z
    .string()
    .optional()
    .describe(
      'Optional baseline network behavior data to compare against. If not provided, the system will attempt to establish a baseline from the provided networkTrafficData.'
    ),
});
export type DetectNetworkAnomalyInput = z.infer<typeof DetectNetworkAnomalyInputSchema>;

const DetectNetworkAnomalyOutputSchema = z.object({
  anomalyDetected: z.boolean().describe('Whether an anomaly was detected.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
  confidenceScore: z
    .number()
    .describe('A score indicating the confidence level of the anomaly detection.'),
});
export type DetectNetworkAnomalyOutput = z.infer<typeof DetectNetworkAnomalyOutputSchema>;

// We need a schema for the prompt that includes the historical anomalies.
const DetectNetworkAnomalyPromptSchema = DetectNetworkAnomalyInputSchema.extend({
    historicalAnomalies: z.array(DetectNetworkAnomalyOutputSchema).optional().describe('An array of previously detected anomalies to learn from.')
});


export async function detectNetworkAnomaly(
  input: DetectNetworkAnomalyInput
): Promise<DetectNetworkAnomalyOutput> {
  return detectNetworkAnomalyFlow(input);
}

const detectNetworkAnomalyPrompt = ai.definePrompt({
  name: 'detectNetworkAnomalyPrompt',
  input: {schema: DetectNetworkAnomalyPromptSchema},
  output: {schema: DetectNetworkAnomalyOutputSchema},
  prompt: `You are a network security expert tasked with analyzing network traffic data for anomalies. You learn over time.

  You are provided with new network traffic data, an optional baseline of normal network behavior, and a list of historical anomalies that have been detected in the past.
  Your goal is to identify any deviations from the norm that could indicate security threats or protocol violations, taking into account past findings.

  Analyze the provided network traffic data and compare it to the baseline network behavior, if provided. If a baseline is not provided, attempt to establish one from the data.
  
  Also, consider the historical anomalies provided. Use them as examples of what has been considered anomalous before. This will help you to be more accurate. If you see similar patterns, you should flag them. Also, look for new types of anomalies that haven't been seen before.

  Network Traffic Data:
  {{networkTrafficData}}

  Baseline Network Behavior (if available):
  {{#if baselineNetworkBehavior}}
  {{baselineNetworkBehavior}}
  {{else}}
  No baseline network behavior provided. Attempting to learn it from the above data.
  {{/if}}

  Historical Anomalies (for learning):
  {{#if historicalAnomalies}}
  {{#each historicalAnomalies}}
  - Description: {{this.anomalyDescription}}, Confidence: {{this.confidenceScore}}
  {{/each}}
  {{else}}
  No historical anomalies provided yet. You are establishing the first baseline.
  {{/if}}

  Based on your complete analysis, determine whether an anomaly is present in the *new* network traffic data. Provide a description of the anomaly, if detected, and a confidence score indicating the certainty of your detection.

  Follow the output schema format exactly, and provide a confidenceScore between 0 and 1.
  `,
});

const detectNetworkAnomalyFlow = ai.defineFlow(
  {
    name: 'detectNetworkAnomalyFlow',
    inputSchema: DetectNetworkAnomalyInputSchema,
    outputSchema: DetectNetworkAnomalyOutputSchema,
  },
  async input => {
    // Fetch recent anomalies from Firestore to provide as context for learning.
    const historicalAnomalies = await getRecentAnomalies(10);
    
    const promptInput = {
      ...input,
      historicalAnomalies,
    };

    const {output} = await detectNetworkAnomalyPrompt(promptInput);
    return output!;
  }
);
