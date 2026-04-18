import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import React from 'react';

interface ColorRate {
  color: string;
  total: number;
  topped: number;
  rate: number;
}

interface ColorAvg {
  color: string;
  total: number;
  avgTries: number;
}

interface Props {
  toppedRate: ColorRate[];
  avgTries: ColorAvg[];
}

export default function EffortVsSuccessChart({ toppedRate, avgTries }: Props) {
  const avgMap = Object.fromEntries(avgTries.map(r => [r.color, r.avgTries]));

  const points = toppedRate
    .filter(r => r.total >= 3) // need enough data to be meaningful
    .map(r => ({
      id: r.color,
      x: avgMap[r.color] ?? 0,
      y: r.rate,
      color: ascentColors[r.color as keyof typeof ascentColors] ?? '#888',
      label: r.color.charAt(0).toUpperCase() + r.color.slice(1),
    }))
    .filter(p => p.x > 0);

  if (points.length < 2) return null;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const series = points.map(p => ({
    id: p.id,
    label: p.label,
    data: [{ id: p.id, x: p.x, y: p.y }],
    color: p.color,
    markerSize: 10,
    highlightScope: { highlight: 'series', fade: 'global' } as const,
  }));

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">Effort vs Success</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Top-left = easy tops. Bottom-right = hard projects.
        </Typography>
        <ScatterChart
          xAxis={[{
            label: 'Average tries',
            min: 0,
            max: maxX * 1.1,
            labelStyle: { transform: 'translateY(10px)' }
          }]}
          yAxis={[{
            label: 'Topped %',
            min: 0,
            max: 100,
            labelStyle: { transform: 'translateX(-10px)' }
          }]}
          series={series}
          height={300}
          margin={{ left: 0, right: 5, top: 15, bottom: 30 }}
        />
      </CardContent>
    </Card>
  );
}
