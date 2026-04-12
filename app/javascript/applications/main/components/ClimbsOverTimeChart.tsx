import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { format, parseISO } from 'date-fns';
import React from 'react';

interface DataPoint {
  date: string;
  [color: string]: number | string;
}

interface Props {
  data: DataPoint[];
}

export default function ClimbsOverTimeChart({ data }: Props) {
  if (!data || data.length === 0) {
    return null;
  }

  // Derive color keys from the data, excluding the date field.
  // Only include colors that have at least one climb.
  const activeColors = Object.keys(data[0])
    .filter(key => key !== 'date')
    .filter(color => data.some(row => (row[color] as number) > 0));

  const xAxisData = data.map(row => parseISO(row.date));

  const series = activeColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    data: data.map(row => row[color] as number),
    color: ascentColors[color],
    showMark: false,
    curve: 'linear' as const,
  }));

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }} data-testid="climbs-over-time-chart">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Climbs Completed Over Time
        </Typography>
        <LineChart
          xAxis={[{
            data: xAxisData,
            scaleType: 'time',
            valueFormatter: (value: Date) => format(value, 'MMM d, yyyy'),
          }]}
          yAxis={[{ label: 'Cumulative Climbs' }]}
          series={series}
          height={320}
          margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
          slotProps={{ legend: { hidden: false } }}
        />
      </CardContent>
    </Card>
  );
}
