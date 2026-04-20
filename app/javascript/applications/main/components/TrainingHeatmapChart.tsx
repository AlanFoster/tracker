import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

interface HourData {
  hour: number;
  count: number;
}

interface DayData {
  day: string;
  hours: HourData[];
}

interface Props {
  trainingHeatmap: DayData[];
}

export default function TrainingHeatmapChart({ trainingHeatmap }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!trainingHeatmap || trainingHeatmap.length === 0) return null;

  // Calculate max count for color scaling
  const maxCount = Math.max(
    ...trainingHeatmap.flatMap(day =>
      day.hours.map(hour => hour.count)
    )
  );

  if (maxCount === 0) return null;

  // Generate color intensity based on count with theme awareness
  const getColor = (count: number) => {
    if (count === 0) {
      return theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    }
    const intensity = count / maxCount;
    const alpha = Math.max(0.2, intensity * 0.8);

    // Use theme primary color for better integration
    const baseColor = theme.palette.primary.main;
    const rgb = theme.palette.mode === 'dark'
      ? '144, 202, 249' // Light blue for dark mode
      : '25, 118, 210';  // Darker blue for light mode

    return `rgba(${rgb}, ${alpha})`;
  };

  const cellSize = isMobile ? 12 : 18;
  const fontSize = isMobile ? '0.55rem' : '0.75rem';
  const dayLabelWidth = isMobile ? 28 : 80;

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Training Activity Heatmap</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Ascents by day of week and hour of day
        </Typography>

        <Box sx={{
          width: '100%',
          overflowX: 'auto',
          pb: isMobile ? 1 : 0,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Box sx={{
            minWidth: isMobile ? 24 * cellSize + dayLabelWidth + 20 : 24 * cellSize + 100,
            maxWidth: isMobile ? 'none' : 24 * cellSize + 100
          }}>
            {/* Hour labels */}
            <Box sx={{ display: 'flex', mb: 1 }}>
              {/* Spacer for day label */}
              <Box sx={{ width: dayLabelWidth, pr: isMobile ? 0.5 : 1, flexShrink: 0 }} />

              {Array.from({ length: 24 }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: cellSize,
                    minWidth: cellSize,
                    height: isMobile ? cellSize * 0.8 : cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: fontSize,
                    color: 'text.secondary',
                    mr: isMobile ? 0.5 : 0.5,
                    // Invisible border to match heatmap cells
                    border: '1px solid transparent'
                  }}
                >
                  {i % (isMobile ? 6 : 4) === 0 && i < 21 ? i : ''}
                </Box>
              ))}
            </Box>

            {/* Heatmap grid */}
            {trainingHeatmap.map((dayData) => (
              <Box key={dayData.day} sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 0.5 : 0.5 }}>
                {/* Day label */}
                <Box
                  sx={{
                    width: dayLabelWidth,
                    fontSize: fontSize,
                    color: 'text.secondary',
                    textAlign: 'right',
                    pr: isMobile ? 0.5 : 1,
                    flexShrink: 0,
                    fontWeight: isMobile ? 500 : 400
                  }}
                >
                  {isMobile ? dayData.day.slice(0, 2) : dayData.day}
                </Box>

                {/* Hour cells */}
                <Box sx={{ display: 'flex' }}>
                  {dayData.hours.map((hourData) => (
                    <Box
                      key={hourData.hour}
                      sx={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getColor(hourData.count),
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: isMobile ? 1 : 0.5,
                        mr: isMobile ? 0.5 : 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minWidth: cellSize, // Prevent shrinking
                        '&:hover': {
                          transform: isMobile ? 'scale(1.2)' : 'scale(1.1)',
                          zIndex: 1,
                          boxShadow: theme.palette.mode === 'dark' ? 2 : 1,
                          border: `2px solid ${theme.palette.primary.main}`
                        },
                        // Better touch targets on mobile
                        '&:active': isMobile ? {
                          transform: 'scale(0.95)',
                          backgroundColor: theme.palette.primary.light
                        } : {}
                      }}
                      title={`${dayData.day} ${hourData.hour}:00 - ${hourData.count} ascent${hourData.count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </Box>
              </Box>
            ))}

            {/* Legend */}
            <Box sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 0.5 : 1,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              justifyContent: 'center',
              ml: isMobile ? dayLabelWidth / 8 : 8
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: isMobile ? 0.5 : 0 }}>
                Less
              </Typography>
              <Box sx={{ display: 'flex', gap: isMobile ? 0.25 : 0.5 }}>
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => {
                  const legendColor = intensity === 0
                    ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                    : `rgba(${theme.palette.mode === 'dark' ? '144, 202, 249' : '25, 118, 210'}, ${Math.max(0.2, intensity * 0.8)})`;

                  return (
                    <Box
                      key={intensity}
                      sx={{
                        width: isMobile ? 10 : 12,
                        height: isMobile ? 10 : 12,
                        backgroundColor: legendColor,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 0.5
                      }}
                    />
                  );
                })}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: isMobile ? 0.5 : 0 }}>
                More
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
