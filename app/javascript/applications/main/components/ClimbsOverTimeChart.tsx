import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { HighlightItemData } from '@mui/x-charts/context';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { format, parseISO } from 'date-fns';
import React from 'react';

interface DataPoint {
  date: string;
  [color: string]: number | string;
}

interface Props {
  daily: DataPoint[];
  cumulative: DataPoint[];
}

interface LegendItem {
  id: string;
  label: string;
  color: string;
}

interface CustomLegendProps {
  items: LegendItem[];
  highlightedId: string | null;
  onItemClick: (id: string) => void;
}

function CustomLegend({ items, highlightedId, onItemClick }: CustomLegendProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1, justifyContent: 'center' }}>
      {items.map(item => (
        <Box
          key={item.id}
          onClick={() => onItemClick(item.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            borderRadius: 1,
            px: 0.5,
            opacity: highlightedId && highlightedId !== item.id ? 0.35 : 1,
            transition: 'opacity 0.15s',
            '&:hover': { opacity: highlightedId === item.id ? 1 : 0.75 },
          }}
        >
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
          <Typography variant="caption">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function useActiveColors(data: DataPoint[]) {
  return Object.keys(data[0])
    .filter(key => key !== 'date')
    .filter(color => data.some(row => (row[color] as number) > 0));
}

function Chart({ data, yLabel, highlightedItem, onHighlightChange, isCumulative = false }: {
  data: DataPoint[];
  yLabel: string;
  highlightedItem: HighlightItemData | null;
  onHighlightChange: (item: HighlightItemData | null) => void;
  isCumulative?: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const activeColors = useActiveColors(data);

  // For cumulative charts, prepend a starting point at 0
  const chartData = isCumulative && data.length > 0 ? [
    { date: data[0].date, ...Object.fromEntries(activeColors.map(c => [c, 0])) },
    ...data
  ] : data;

  const xAxisData = chartData.map(row => parseISO(row.date));

  const series = activeColors.map(color => ({
    id: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
    data: chartData.map(row => row[color] as number),
    color: ascentColors[color as keyof typeof ascentColors],
    showMark: false,
    curve: 'linear' as const,
    highlightScope: { highlight: 'series', fade: 'global' } as const,
  }));

  return (
    <LineChart
      xAxis={[{
        data: xAxisData,
        scaleType: 'time',
        valueFormatter: (v: Date) => format(v, 'MMM d, yyyy'),
        min: xAxisData[0]?.getTime(),
        max: xAxisData[xAxisData.length - 1]?.getTime()
      }]}
      yAxis={[{ label: isMobile ? '' : yLabel, width: isMobile ? 30 : 60, min: 0 }]}
      series={series}
      height={280}
      margin={{ left: isMobile ? 10 : 0, right: 20, top: 10, bottom: 40 }}
      highlightedItem={highlightedItem}
      onHighlightChange={onHighlightChange}
      hideLegend
    />
  );
}

function StackedBarChart({ data, highlightedItem, onHighlightChange }: {
  data: DataPoint[];
  highlightedItem: HighlightItemData | null;
  onHighlightChange: (item: HighlightItemData | null) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const activeColors = useActiveColors(data);
  const xAxisData = data.map(row => format(parseISO(row.date), 'MMM d'));

  const series = activeColors.map(color => ({
    id: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
    data: data.map(row => row[color] as number),
    color: ascentColors[color as keyof typeof ascentColors],
    stack: 'daily',
    highlightScope: { highlight: 'series', fade: 'global' } as const,
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: xAxisData }]}
      yAxis={[{ label: isMobile ? '' : 'Climbs', width: isMobile ? 30 : 60, min: 0 }]}
      series={series}
      height={280}
      margin={{ left: isMobile ? 10 : 0, right: 20, top: 10, bottom: 40 }}
      highlightedItem={highlightedItem}
      onHighlightChange={onHighlightChange}
      hideLegend
    />
  );
}

export default function ClimbsOverTimeChart({ daily, cumulative }: Props) {
  const [mode, setMode] = React.useState<'cumulative' | 'daily' | 'stacked'>('cumulative');
  const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);

  const hasData = cumulative.length > 0 || daily.length > 0;
  if (!hasData) return null;

  const activeData = mode === 'cumulative' ? cumulative : daily;
  const activeColors = activeData.length > 0
    ? Object.keys(activeData[0])
        .filter(key => key !== 'date')
        .filter(color => activeData.some(row => (row[color] as number) > 0))
    : [];

  const legendItems: LegendItem[] = activeColors.map(color => ({
    id: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
    color: ascentColors[color as keyof typeof ascentColors],
  }));

  const handleLegendClick = (id: string) => {
    setHighlightedItem(prev => prev?.seriesId === id ? null : { seriesId: id });
  };

  const handleModeChange = (_: React.MouseEvent, val: string | null) => {
    if (val) {
      setMode(val as typeof mode);
    }
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }} data-testid="climbs-over-time-chart">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Climbs Over Time</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            size="small"
            onChange={handleModeChange}
            aria-label="chart mode"
          >
            <ToggleButton value="cumulative" aria-label="cumulative">Cumulative</ToggleButton>
            <ToggleButton value="daily" aria-label="daily">Daily</ToggleButton>
            <ToggleButton value="stacked" aria-label="stacked">Stacked</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <CustomLegend
          items={legendItems}
          highlightedId={highlightedItem?.seriesId as string ?? null}
          onItemClick={handleLegendClick}
        />

        {mode === 'cumulative' && cumulative.length > 0 && (
          <Chart
            data={cumulative}
            yLabel="Cumulative Climbs"
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
            isCumulative={true}
          />
        )}
        {mode === 'daily' && daily.length > 0 && (
          <Chart
            data={daily}
            yLabel="Climbs"
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
            isCumulative={false}
          />
        )}
        {mode === 'stacked' && daily.length > 0 && (
          <StackedBarChart
            data={daily}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
          />
        )}
      </CardContent>
    </Card>
  );
}
