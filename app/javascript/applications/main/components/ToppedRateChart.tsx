import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface ColorRate {
  color: string;
  total: number;
  topped: number;
  rate: number;
}

interface Props {
  toppedRate: ColorRate[];
}

export default function ToppedRateChart({ toppedRate }: Props) {
  if (!toppedRate || toppedRate.length === 0) return null;

  const sorted = [...toppedRate]
    .filter(r => r.total > 0)
    .sort((a, b) => b.rate - a.rate);

  if (sorted.length === 0) return null;

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Topped Rate by Color</Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {sorted.map(({ color, rate, topped, total }) => {
            const barColor = ascentColors[color as keyof typeof ascentColors] ?? '#888';
            const label = color.charAt(0).toUpperCase() + color.slice(1);
            return (
              <Box key={color}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={500}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topped}/{total} ({rate}%)
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 12, borderRadius: 6, bgcolor: 'action.hover', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${rate}%`,
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
