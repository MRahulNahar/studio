
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

export type Alert = {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  flowId?: string;
};

export type ProtocolStat = {
  name: string;
  value: number;
  fill: string;
};

export type Anomaly = {
  id?: string;
  timestamp: any;
  anomalyDetected: boolean;
  anomalyDescription: string;
  confidenceScore: number;
}
