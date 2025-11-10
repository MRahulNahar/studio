
export type Flow = {
  id: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'DNS';
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  state: 'LISTEN' | 'SYN_SENT' | 'ESTABLISHED' | 'FIN_WAIT_1' | 'FIN_WAIT_2' | 'TIME_WAIT' | 'CLOSED' | 'ACTIVE';
  startTime: Date;
  packets: number;
  bytes: number;
};

export type ProtocolStat = {
  name: string;
  value: number;
  fill: string;
};

export type Anomaly = {
  id: string;
  timestamp: Date;
  anomalyDescription: string;
  confidenceScore: number;
  isGenuineAttack: boolean;
  attackClassification: string;
};
