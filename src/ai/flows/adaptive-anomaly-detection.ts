'use server';

/**
 * @fileOverview This file implements the adaptive anomaly detection flow for network traffic analysis.
 *
 * It uses an AI model to learn normal network behavior and identify deviations that could indicate security threats or protocol violations.
 *
 * @exports {detectNetworkAnomaly} - The main function to detect network anomalies.
 * @exports {DetectNetworkAnomalyInput} - The input type for the detectNetworkAnomaly function.
 * @exports {DetectNetworkAnomalyOutput} - The output type for the detectNetworkAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function detectNetworkAnomaly(
  input: DetectNetworkAnomalyInput
): Promise<DetectNetworkAnomalyOutput> {
  return detectNetworkAnomalyFlow(input);
}

const detectNetworkAnomalyPrompt = ai.definePrompt({
  name: 'detectNetworkAnomalyPrompt',
  input: {schema: DetectNetworkAnomalyInputSchema},
  output: {schema: DetectNetworkAnomalyOutputSchema},
  prompt: `You are a network security expert tasked with analyzing network traffic data for anomalies.

  You are provided with network traffic data and, optionally, a baseline of normal network behavior.
  Your goal is to identify any deviations from the norm that could indicate security threats or protocol violations.

  Analyze the provided network traffic data and compare it to the baseline network behavior, if provided.  If a baseline is not provided, attempt to establish one from the data. Identify any unusual patterns, unexpected protocol sequences, or other anomalies that warrant investigation.

  Network Traffic Data:
  {{networkTrafficData}}

  Baseline Network Behavior (if available):
  {{#if baselineNetworkBehavior}}
  {{baselineNetworkBehavior}}
  {{else}}
  No baseline network behavior provided. Attempting to learn it from the above data.
  {{/if}}

  Based on your analysis, determine whether an anomaly is present. Provide a description of the anomaly, if detected, and a confidence score indicating the certainty of your detection.

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
    const {output} = await detectNetworkAnomalyPrompt(input);
    return output!;
  }
);
