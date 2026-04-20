import AvgTriesChart from '@javascript/applications/main/components/AvgTriesChart';
import AscentsPerSessionChart from '@javascript/applications/main/components/AscentsPerSessionChart';
import ClimbsOverTimeChart from '@javascript/applications/main/components/ClimbsOverTimeChart';
import EffortVsSuccessChart from '@javascript/applications/main/components/EffortVsSuccessChart';
import FlashRateChart from '@javascript/applications/main/components/FlashRateChart';
import SessionsByDayChart from '@javascript/applications/main/components/SessionsByDayChart';
import SessionsByIntentChart from '@javascript/applications/main/components/SessionsByIntentChart';
import ToppedRateChart from '@javascript/applications/main/components/ToppedRateChart';
import ToppedRateOverTimeChart from '@javascript/applications/main/components/ToppedRateOverTimeChart';
import TrainingHeatmapChart from '@javascript/applications/main/components/TrainingHeatmapChart';
import { Layout } from '@javascript/applications/main/components/Layout';
import { Box, Typography } from '@mui/material';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';

export default function StatisticsShow() {
  const { avgTries, toppedRateOverTime, climbsOverTime, toppedRate, flashRate, ascentsPerSession, sessionsByIntent, sessionsByDayOfWeek, trainingHeatmap } = useContent() as any;

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" mb={2}>Statistics</Typography>
        <ClimbsOverTimeChart
          daily={climbsOverTime.daily}
          cumulative={climbsOverTime.cumulative}
        />
        <AscentsPerSessionChart ascentsPerSession={ascentsPerSession} />
        <SessionsByIntentChart sessionsByIntent={sessionsByIntent} />
        <SessionsByDayChart sessionsByDayOfWeek={sessionsByDayOfWeek} />
        <TrainingHeatmapChart trainingHeatmap={trainingHeatmap} />
        <ToppedRateChart toppedRate={toppedRate} />
        <FlashRateChart flashRate={flashRate} />
        <AvgTriesChart avgTries={avgTries} />
        <EffortVsSuccessChart toppedRate={toppedRate} avgTries={avgTries} />
        <ToppedRateOverTimeChart toppedRateOverTime={toppedRateOverTime} />
      </Box>
    </Layout>
  );
}
