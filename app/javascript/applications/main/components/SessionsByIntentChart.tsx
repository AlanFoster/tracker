import { Box, Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import React from 'react';

interface IntentCount {
  intent: string;
  count: number;
}

interface Props {
  sessionsByIntent: IntentCount[];
}

const intentColors: string[] = [
  '#42a5f5', // fun
  '#66bb6a', // volume
  '#ef5350', // projecting
  '#ab47bc', // recovery
  '#ffa726', // technique
  '#26c6da', // progression
];

export default function SessionsByIntentChart({ sessionsByIntent }: Props) {
  if (!sessionsByIntent || sessionsByIntent.length === 0) return null;

  const data = sessionsByIntent.map(({ intent, count }, i) => ({
    id: intent,
    value: count,
    label: `${intent.charAt(0).toUpperCase() + intent.slice(1)} (${i})`,
    color: intentColors[i % intentColors.length],
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={1}>Sessions by Intent</Typography>
        <Box display="flex" justifyContent="center">
          <PieChart
            colors={data.map(d => d.color)}
            series={[{
              data,
              innerRadius: 60,
              outerRadius: 110,
              paddingAngle: 2,
              cornerRadius: 4,
              valueFormatter: (item) => `${item.value} (${((item.value / total) * 100).toFixed(1)}%)`,
              highlightScope: { highlight: 'item', fade: 'global' },
            }]}
            height={280}
            width={420}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 6,
                itemGap: 8,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
