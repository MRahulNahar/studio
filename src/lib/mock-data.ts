import type { Flow, Alert, ProtocolStat } from './types';

const protocols: Flow['protocol'][] = ['TCP', 'UDP', 'HTTP', 'DNS'];
const tcpStates: Flow['state'][] = ['LISTEN', 'SYN_SENT', 'ESTABLISHED', 'FIN_WAIT_1', 'FIN_WAIT_2', 'TIME_WAIT', 'CLOSED'];

const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomPort = () => Math.floor(Math.random() * 65535) + 1;
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateInitialFlows = (count: number): Flow[] => {
  const flows: Flow[] = [];
  for (let i = 0; i < count; i++) {
    const protocol = randomElement(protocols);
    flows.push({
      id: `flow_${i}_${Date.now()}`,
      protocol,
      sourceIp: randomIp(),
      sourcePort: randomPort(),
      destIp: randomIp(),
      destPort: protocol === 'HTTP' ? 80 : protocol === 'DNS' ? 53 : randomPort(),
      state: protocol === 'TCP' ? randomElement(tcpStates) : 'ACTIVE',
      startTime: new Date(Date.now() - Math.random() * 3600 * 1000),
      packets: Math.floor(Math.random() * 10000),
      bytes: Math.floor(Math.random() * 10000000),
    });
  }
  return flows;
};

export const initialAlerts: Alert[] = [
  { id: 'alert_1', timestamp: new Date(Date.now() - 10000), severity: 'warning', message: 'Unexpected protocol sequence on flow_3', flowId: 'flow_3' },
  { id: 'alert_2', timestamp: new Date(Date.now() - 25000), severity: 'info', message: 'New high-traffic DNS server detected.', flowId: 'flow_8' },
  { id: 'alert_3', timestamp: new Date(Date.now() - 45000), severity: 'critical', message: 'Malformed HTTP packet detected from 192.168.1.101', flowId: 'flow_1' },
];

export const protocolStats: ProtocolStat[] = [
  { name: 'TCP', value: 400, fill: 'hsl(204 100% 40%)' },
  { name: 'UDP', value: 300, fill: 'hsl(25 95% 53%)' },
  { name: 'HTTP', value: 200, fill: 'hsl(120 80% 35%)' },
  { name: 'DNS', value: 278, fill: 'hsl(320 70% 50%)' },
  { name: 'Other', value: 189, fill: 'hsl(60 70% 45%)' },
];

export const defaultTrafficData = `14:32:01.123456 IP 192.168.1.10.54321 > 8.8.8.8.53: 1234+ A? google.com. (28)
14:32:01.125678 IP 8.8.8.8.53 > 192.168.1.10.54321: 1234 1/0/0 A 172.217.16.14 (44)
14:32:05.456789 IP 10.0.0.5.12345 > 10.0.0.1.80: Flags [S], seq 1000, win 65535, options [mss 1460,sackOK,TS val 100 ecr 0,nop,wscale 7], length 0
14:32:05.456999 IP 10.0.0.1.80 > 10.0.0.5.12345: Flags [S.], seq 2000, ack 1001, win 65535, options [mss 1460,sackOK,TS val 200 ecr 100,nop,wscale 7], length 0
14:32:05.457111 IP 10.0.0.5.12345 > 10.0.0.1.80: Flags [.], ack 1, win 512, options [nop,nop,TS val 101 ecr 200], length 0
14:32:05.500123 IP 10.0.0.5.12345 > 10.0.0.1.80: Flags [P.], seq 1:201, ack 1, win 512, options [nop,nop,TS val 102 ecr 200], length 200: HTTP: GET /index.html HTTP/1.1
`;
