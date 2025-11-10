'use client';

import * as React from 'react';
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { protocolStats } from '@/lib/mock-data';

export function ProtocolDistributionChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Protocol Distribution</CardTitle>
          <CardDescription>Breakdown of observed protocols.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center pb-8">
          <div className="h-[250px] w-full animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Distribution</CardTitle>
        <CardDescription>Breakdown of observed protocols.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-8">
        <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={protocolStats} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
              {protocolStats.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              content={({ payload }) => {
                return (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-4 text-sm text-muted-foreground">
                    {payload?.map((entry) => (
                      <li key={`item-${entry.value}`} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
