import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface ColorAvg {
  color: string;
  total: number;
  avgTries: number;
}

interface Props {
  avgTries: ColorAvg[];
}

export default function AvgTriesChart({ avgTries }: Props) {
  if (!avgTries || avgTries.length === 0) return null;

  const sorted = [...avgTries]
    .filter(r => r.total > 0)
    .sort((a, b) => b.avgTries - a.avgTries);

  if (sorted.length === 0) return null;

  const max = sorted[0].avgTries;

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Average Tries by Color</Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {sorted.map(({ color, avgTries: avg, total }) => {
            const barColor = ascentColors[color as keyof typeof ascentColors] ?? '#888';
            const label = color.charAt(0).toUpperCase() + color.slice(1);
            const pct = max > 0 ? (avg / max) * 100 : 0;
            return (
              <Box key={color}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={500}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {avg} average &middot; {total} ascents
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 12, borderRadius: 6, bgcolor: 'action.hover', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${pct}%`,
                      bgcolor: barColor,
                      borderRadius: 6,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
