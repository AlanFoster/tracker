import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import { AscentsOverview } from '@javascript/applications/main/components/AscentsOverview';
import { ascentsAsEmojis } from '@javascript/applications/main/components/Emoji';
import { Layout } from '@javascript/applications/main/components/Layout';
import ShareButton from '@javascript/applications/main/components/ShareButton';
import { useAppSelector } from '@javascript/applications/main/store';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import AscentFormModal from './AscentModal';
import AscentsSummary from './AscentsSummary';

function bucketEventsByTime(events, bucketSizeMs = 1000 * 60 * 5) {
  const countsByBucket = new Map();
  const eventTypesSet = new Set();
  const totals = new Map();

  // floor date to bucket boundary
  function floorToBucket(date) {
    const time = date.getTime();
    return new Date(Math.floor(time / bucketSizeMs) * bucketSizeMs);
  }

  // Count events per bucket per type
  for (const { date, eventType } of events) {
    if (!date) {
      continue;
    }
    eventTypesSet.add(eventType);

    const d = floorToBucket(new Date(date));
    const key = d.toISOString();

    if (!countsByBucket.has(key)) {
      countsByBucket.set(key, {});
    }

    const bucket = countsByBucket.get(key);
    bucket[eventType] = (bucket[eventType] ?? 0) + 1;

    totals.set(eventType, (totals.get(eventType) || 0) + 1);
  }

  // Determine bucket range
  const bucketKeys = [...countsByBucket.keys()].sort();
  const start = new Date(bucketKeys[0]);
  const end = new Date(bucketKeys[bucketKeys.length - 1]);

  // Fill missing buckets
  const result = [];
  let current = new Date(start);

  while (current <= end) {
    const key = current.toISOString();
    const existing = countsByBucket.get(key) ?? {};

    const row = { date: key };
    for (const type of eventTypesSet) {
      row[type] = existing[type] ?? 0;
    }

    result.push(row);
    current = new Date(current.getTime() + bucketSizeMs);
  }

  return { data: result, eventTypes: Array.from(eventTypesSet), totals };
}

export default function SessionsShow() {
  const { session, ascentModal, backPath } = useContent() as any;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );
  const { visit } = useContext(NavigationContext);

  const [ascentsView, setAscentsView] = React.useState('grid');
  const [summaryView, setSummaryView] = React.useState('graph');
  const theme = useTheme();
  const smallSize = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAscentsViewChange = (event, newView) => {
    if (newView !== null) {
      setAscentsView(newView);
    }
  };

  const handleSummaryViewChange = (event, newView) => {
    if (newView !== null) {
      setSummaryView(newView);
    }
  };

  const { data, eventTypes, totals } = bucketEventsByTime(
    session.ascents.map(ascent => ({ date: ascent.createdAt, eventType: ascent.color })),
  );

  return (
    <Layout>
      <AscentFormModal
        ascentForm={ascentModal.ascentForm}
        showModal={ascentModal.showModal}
        validationErrors={validationErrors}
        onClose={() => visit(session.detailPath)}
      />

      <Stack spacing={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href={backPath} data-sg-visit>
            Sessions
          </Link>
          <Typography sx={{ color: 'text.primary' }}>Session</Typography>
        </Breadcrumbs>

        <Typography variant="h4">Overview</Typography>

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          bgcolor="background.paper"
          mb={2}
        >
          <ToggleButtonGroup
            value={summaryView}
            size="medium"
            exclusive
            onChange={handleSummaryViewChange}
            aria-label="view toggle"
          >
            <ToggleButton sx={{ padding: '6px 16px' }} value="graph" aria-label="ascent summary graph view">
              <BarChartIcon />
            </ToggleButton>
            <ToggleButton sx={{ padding: '6px 16px' }} value="grid" aria-label="ascent summary grid view">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {summaryView === 'graph'
          &&
            <Box data-testid='ascent-summary-graph-view'>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: data.map(x => x.date),
                  valueFormatter: d =>
                    new Date(d).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                },
              ]}
              series={[...eventTypes].map(eventType =>
                ({
                  label: `${totals.get(eventType)} ${eventType[0].toUpperCase()}${eventType.substring(1)}`,
                  data: data.map(x => x[eventType]),
                  stack: 'events',
                  color: ascentColors[eventType],
                }),
              )}
              height={smallSize ? 160 : 250}
            />
          </Box>
        }
        {summaryView === 'grid' && <Box data-testid='ascent-summary-grid-view'><AscentsSummary ascentCounts={session.summary.ascentCounts} /></Box>}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          bgcolor="background.paper"
          mb={2}
        >
          <Typography variant="h5">
            {session.title}
            {' '}
            <Chip label={session.intent} color="success" variant="outlined" />
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              href={session.newAscentPath}
              variant="contained"
              startIcon={<AddIcon />}
              data-sg-visit
            >
              Add
            </Button>
            <ShareButton
              label="Share"
              disabled={session.ascents.length === 0}
              onShare={() =>
                ascentsAsEmojis(session.ascents)}
            />
            <ToggleButtonGroup
              value={ascentsView}
              size="medium"
              exclusive
              onChange={handleAscentsViewChange}
              aria-label="view toggle"
            >
              <ToggleButton sx={{ padding: '6px 16px' }} value="list" aria-label="ascent list view">
                <ViewStreamIcon />
              </ToggleButton>
              <ToggleButton sx={{ padding: '6px 16px' }} value="grid" aria-label="ascent grid view">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AscentsOverview ascents={session.ascents} view={ascentsView} />
          </CardContent>
        </Card>
      </Stack>
    </Layout>
  );
}
