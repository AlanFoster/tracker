import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { HighlightItemData } from '@mui/x-charts/context';
import { LineChart } from '@mui/x-charts/LineChart';
import { parse } from 'date-fns';
import React from 'react';

interface SeriesPoint {
  month: string;
  rate: number | null;
}

interface Series {
  color: string;
  data: SeriesPoint[];
}

interface Props {
  toppedRateOverTime: {
    months: string[];
    series: Series[];
  };
}

export default function ToppedRateOverTimeChart({ toppedRateOverTime }: Props) {
  const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!toppedRateOverTime?.months?.length || !toppedRateOverTime?.series?.length) return null;

  const { months, series } = toppedRateOverTime;

  // Need at least 2 months to show a meaningful trend
  if (months.length < 2) return null;

  const xAxisData = months.map(m => parse(m, 'yyyy-MM', new Date()));

  const chartSeries = series.map(s => ({
    id: s.color,
    label: s.color.charAt(0).toUpperCase() + s.color.slice(1),
    data: s.data.map(d => d.rate),
    color: ascentColors[s.color as keyof typeof ascentColors],
    showMark: true,
    curve: 'linear' as const,
    connectNulls: false,
    highlightScope: { highlight: 'series', fade: 'global' } as const,
  }));

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Topped Rate Over Time</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1, justifyContent: 'center' }}>
          {series.map(s => (
            <Box
              key={s.color}
              onClick={() => setHighlightedItem(prev => prev?.seriesId === s.color ? null : { seriesId: s.color })}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                cursor: 'pointer',
                borderRadius: 1,
                px: 0.5,
                opacity: highlightedItem && highlightedItem.seriesId !== s.color ? 0.35 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: ascentColors[s.color as keyof typeof ascentColors], flexShrink: 0 }} />
              <Typography variant="caption">{s.color.charAt(0).toUpperCase() + s.color.slice(1)}</Typography>
            </Box>
          ))}
        </Box>
        <LineChart
          xAxis={[{
            data: xAxisData,
            scaleType: 'time',
            valueFormatter: (v: Date) => `${v.toLocaleString('default', { month: 'short' })} ${v.getFullYear()}`,
          }]}
          yAxis={[{
            label: isMobile ? '' : 'Topped %',
            width: isMobile ? 30 : 60,
            min: 0,
            max: 100,
          }]}
          series={chartSeries}
          height={280}
          margin={{ left: 0, right: 20, top: 10, bottom: 40 }}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighlightedItem}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
