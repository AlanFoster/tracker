import TransferWithinAStation from '@mui/icons-material/DirectionsWalk';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import Scale from '@mui/icons-material/Scale';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

interface SessionsSummaryProps {
  totalSessions: number;
  totalAscents: number;
  averageAscents: number;
}

export default function SessionsSummary({
  totalSessions,
  totalAscents,
  averageAscents,
}: SessionsSummaryProps) {
  const summary = [
    {
      title: 'Total Sessions',
      value: totalSessions,
      icon: <TransferWithinAStation color="success" fontSize="large" />,
    },
    {
      title: 'Total Ascents',
      value: totalAscents,
      icon: <RocketLaunch color="primary" fontSize="large" />,
    },
    {
      title: 'Average Session Ascents',
      value: averageAscents,
      icon: <Scale color="primary" fontSize="large" />,
    },
  ];

  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      gap={2}
    >
      {summary.map(item => (
        <Grid data-testid={`ascents-summary-${item.color}`} key={item.title}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {item.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </CardContent>
            <Box sx={{ ml: 2 }}>{item.icon}</Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
