import { ascentTheme } from '@javascript/components/ascentColors';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import {
  Box,
  Card,
  CardContent,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React from 'react';

export default function AscentsSummary({ ascentCounts }) {
  const summary = ascentCounts.map(ascentCount => ({
    title: ascentCount.title,
    value: ascentCount.value,
    color: ascentCount.color,
    icon: (
      <ThemeProvider theme={ascentTheme}>
        <RocketLaunch color={ascentCount.color} fontSize="large" />
      </ThemeProvider>
    ),
  }));

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap={2}
      sx={{
        '& > *': {
          width: { xs: '100%', sm: 'auto' },
        },
      }}
    >
      {summary.map(item => (
        <Box data-testid={`ascents-summary-${item.color}`} key={item.title}>
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
              {item.change && (
                <Typography
                  variant="body2"
                  color={
                    item.change.startsWith('+')
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  {item.change}
                </Typography>
              )}
            </CardContent>
            <Box sx={{ ml: 2 }}>{item.icon}</Box>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
