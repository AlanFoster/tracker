import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import React from 'react';

interface Week {
  weekStart: string;
  hasSession: boolean;
  sessionCount: number;
}

interface WeeklyActivityRowProps {
  weeklyActivity: Week[];
}

export default function WeeklyActivityRow({ weeklyActivity }: WeeklyActivityRowProps) {
  return (
    <Card sx={{ mt: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Activity by Week</Typography>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" sx={{ overflowX: 'auto', pb: 1 }}>
          {weeklyActivity.map((week) => {
            const label = new Date(week.weekStart + 'T00:00:00').toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
            return (
              <Tooltip key={week.weekStart} title={`Week of ${label} · ${week.sessionCount} session${week.sessionCount !== 1 ? 's' : ''}`} arrow>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{ cursor: 'default' }}
                >
                  {week.hasSession
                    ? <CheckBoxIcon color="success" />
                    : <CheckBoxOutlineBlankIcon color="disabled" />}
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {label}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
