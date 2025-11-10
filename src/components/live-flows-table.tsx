'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Flow } from '@/lib/types';
import { generateInitialFlows } from '@/lib/mock-data';

const tcpStates: Flow['state'][] = ['LISTEN', 'SYN_SENT', 'ESTABLISHED', 'FIN_WAIT_1', 'FIN_WAIT_2', 'TIME_WAIT', 'CLOSED'];

const stateColors: Record<Flow['state'], string> = {
  LISTEN: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  SYN_SENT: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  ESTABLISHED: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  FIN_WAIT_1: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  FIN_WAIT_2: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  TIME_WAIT: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  CLOSED: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
  ACTIVE: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30',
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function FlowRow({ flow, openRow, onToggle, stateHistory }: { flow: Flow, openRow: string | null, onToggle: (id: string) => void, stateHistory: Map<string, Flow['state'][]> }) {
  const isOpen = openRow === flow.id;
  const history = stateHistory.get(flow.id) || [flow.state];

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => onToggle(flow.id)}>
        <TableCell>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell className="font-code text-sm">{`${flow.sourceIp}:${flow.sourcePort}`}</TableCell>
        <TableCell className="font-code text-sm">{`${flow.destIp}:${flow.destPort}`}</TableCell>
        <TableCell>
          <Badge variant="outline">{flow.protocol}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={`${stateColors[flow.state]}`}>{flow.state}</Badge>
        </TableCell>
        <TableCell>{formatDistanceToNow(flow.startTime, { addSuffix: true })}</TableCell>
        <TableCell className="text-right">{flow.packets.toLocaleString()}</TableCell>
        <TableCell className="text-right">{formatBytes(flow.bytes)}</TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={8}>
            <div className="p-4 bg-muted/50 rounded-md">
              <h4 className="font-semibold mb-2">State Transition History</h4>
              <div className="flex items-center gap-2 flex-wrap font-code text-sm">
                {history.map((state, index) => (
                  <React.Fragment key={index}>
                    <Badge variant="outline" className={`${stateColors[state]}`}>{state}</Badge>
                    {index < history.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function LiveFlowsTable() {
  const [flows, setFlows] = React.useState<Flow[]>([]);
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  const [stateHistory] = React.useState<Map<string, Flow['state'][]>>(new Map());

  React.useEffect(() => {
    setFlows(generateInitialFlows(20));
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFlows(prevFlows =>
        prevFlows.map(flow => {
          const shouldUpdate = Math.random() > 0.7;
          if (!shouldUpdate) return flow;

          const newPackets = flow.packets + Math.floor(Math.random() * 10);
          const newBytes = flow.bytes + Math.floor(Math.random() * 1000);
          let newState = flow.state;

          if (flow.protocol === 'TCP' && Math.random() > 0.9) {
            const currentStateIndex = tcpStates.indexOf(flow.state);
            if (currentStateIndex < tcpStates.length - 1) {
              newState = tcpStates[currentStateIndex + 1];
              const history = stateHistory.get(flow.id) || [flow.state];
              if (history[history.length -1] !== newState) {
                history.push(newState);
                stateHistory.set(flow.id, history);
              }
            }
          }
          return { ...flow, packets: newPackets, bytes: newBytes, state: newState };
        }).sort((a,b) => b.startTime.getTime() - a.startTime.getTime())
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [stateHistory]);

  const handleToggleRow = (id: string) => {
    setOpenRow(prev => (prev === id ? null : id));
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Live Flow Table</CardTitle>
        <CardDescription>Real-time network connections with state, duration, and statistics.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Packets</TableHead>
                <TableHead className="text-right">Bytes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flows.length > 0 ? (
                flows.map(flow => <FlowRow key={flow.id} flow={flow} openRow={openRow} onToggle={handleToggleRow} stateHistory={stateHistory} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No active flows.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
