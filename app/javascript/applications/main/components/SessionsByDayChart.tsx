import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BarChart } from '@mui/x-charts/BarChart';
import React from 'react';

interface DayCount {
  day: string;
  count: number;
}

interface Props {
  sessionsByDayOfWeek: DayCount[];
}

export default function SessionsByDayChart({ sessionsByDayOfWeek }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!sessionsByDayOfWeek || sessionsByDayOfWeek.every(d => d.count === 0)) return null;

  const labels = sessionsByDayOfWeek.map(d => isMobile ? d.day.slice(0, 3) : d.day);
  const data = sessionsByDayOfWeek.map(d => d.count);
  const maxCount = Math.max(...data);

  // Highlight the busiest day
  const colors = data.map(count => count === maxCount ? '#90caf9' : '#455a64');

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={1}>Sessions by Day of Week</Typography>
        <BarChart
          xAxis={[{ scaleType: 'band', data: labels }]}
          yAxis={[{ label: isMobile ? '' : 'Sessions', width: isMobile ? 30 : 60, min: 0 }]}
          series={[{
            data,
            color: '#455a64',
          }]}
          colors={colors}
          height={260}
          margin={{ left: 0, right: 20, top: 10, bottom: 40 }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
