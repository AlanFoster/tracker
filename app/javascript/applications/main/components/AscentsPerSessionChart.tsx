import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LineChart } from '@mui/x-charts/LineChart';
import { format, parseISO } from 'date-fns';
import React from 'react';

interface DataPoint {
  date: string;
  [key: string]: number | string;
}

interface Props {
  ascentsPerSession: DataPoint[];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AscentsPerSessionChart({ ascentsPerSession }: Props) {
  const [highlightedColor, setHighlightedColor] = React.useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!ascentsPerSession || ascentsPerSession.length < 2) return null;

  const colorNames = Object.keys(ascentColors);
  const activeColors = colorNames.filter(color =>
    ascentsPerSession.some(row =>
      (row[`${color}_topped`] as number) > 0 || (row[`${color}_not_topped`] as number) > 0
    )
  );

  const xAxisData = ascentsPerSession.map(d => parseISO(d.date));

  const series = activeColors.flatMap(color => {
    const baseColor = ascentColors[color as keyof typeof ascentColors];
    const isSelected = highlightedColor === color;
    const isDimmed = highlightedColor !== null && !isSelected;
    const fadedColor = hexToRgba(baseColor, isDimmed ? 0.08 : 0.35);
    const fullColor = isDimmed ? hexToRgba(baseColor, 0.15) : baseColor;
    const label = color.charAt(0).toUpperCase() + color.slice(1);
    return [
      {
        id: `${color}_not_topped`,
        label: `${label} (not topped)`,
        data: ascentsPerSession.map(row => row[`${color}_not_topped`] as number),
        color: fadedColor,
        showMark: false,
        curve: 'linear' as const,
        stack: 'session',
        area: true,
        highlightScope: { highlight: 'series', fade: 'global' } as const,
      },
      {
        id: `${color}_topped`,
        label: `${label} (topped)`,
        data: ascentsPerSession.map(row => row[`${color}_topped`] as number),
        color: fullColor,
        showMark: false,
        curve: 'linear' as const,
        stack: 'session',
        area: true,
        highlightScope: { highlight: 'series', fade: 'global' } as const,
      },
    ];
  });

  const handleLegendClick = (color: string) => {
    setHighlightedColor(prev => prev === color ? null : color);
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={1}>Ascents per Session</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1, justifyContent: 'center' }}>
          {activeColors.map(color => {
            const baseColor = ascentColors[color as keyof typeof ascentColors];
            const fadedColor = hexToRgba(baseColor, 0.35);
            const label = color.charAt(0).toUpperCase() + color.slice(1);
            const isHighlighted = highlightedColor === color;
            const isDimmed = highlightedColor !== null && !isHighlighted;
            return (
              <Box
                key={color}
                onClick={() => handleLegendClick(color)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  borderRadius: 1,
                  px: 0.5,
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'opacity 0.15s',
                  '&:hover': { opacity: isDimmed ? 0.5 : 1 },
                }}
              >
                {/* Split circle: left half faded (not topped), right half full (topped) */}
                <Box sx={{ position: 'relative', width: 14, height: 14, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', bgcolor: fadedColor }} />
                  <Box sx={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', bgcolor: baseColor }} />
                </Box>
                <Typography variant="caption">{label}</Typography>
              </Box>
            );
          })}
        </Box>

        <LineChart
          xAxis={[{
            data: xAxisData,
            scaleType: 'time',
            valueFormatter: (v: Date) => format(v, 'MMM d, yyyy'),
            min: xAxisData[0]?.getTime(),
            max: xAxisData[xAxisData.length - 1]?.getTime()
          }]}
          yAxis={[{ label: isMobile ? '' : 'Ascents', width: isMobile ? 30 : 60, min: 0 }]}
          series={series}
          height={280}
          margin={{ left: isMobile ? 10 : 0, right: 20, top: 10, bottom: 40 }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
