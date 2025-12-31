import { useAppSelector } from '@javascript/applications/main/store';
import { ascentColors } from '@javascript/components/ascentColors';
import { AscentsOverview } from '@javascript/components/AscentsOverview';
import { ascentsAsEmojis } from '@javascript/components/Emoji';
import { Layout } from '@javascript/components/Layout';
import ShareButton from '@javascript/components/ShareButton';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import AscentFormModal from './AscentModal';
import AscentsSummary from './AscentsSummary';

function bucketEventsByTime(events, bucketSizeMs = 1000 * 60 * 5) {
  const countsByBucket = new Map();
  const eventTypesSet = new Set();

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

  return { data: result, eventTypes: Array.from(eventTypesSet) };
}

export default function SessionsShow() {
  const { session, ascentModal, backPath } = useContent() as any;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );
  const { visit } = useContext(NavigationContext);

  const [view, setView] = React.useState('grid');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const { data, eventTypes } = bucketEventsByTime(
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
              label: eventType[0].toUpperCase() + eventType.substring(1),
              data: data.map(x => x[eventType]),
              stack: 'events',
              color: ascentColors[eventType],
            }),
          )}
          height={250}
        />
        <AscentsSummary ascentCounts={session.summary.ascentCounts} />

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
              value={view}
              size="medium"
              exclusive
              onChange={handleViewChange}
              aria-label="view toggle"
            >
              <ToggleButton sx={{ padding: '6px 16px' }} value="list" aria-label="list view">
                <ViewStreamIcon />
              </ToggleButton>
              <ToggleButton sx={{ padding: '6px 16px' }} value="grid" aria-label="grid view">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AscentsOverview ascents={session.ascents} view={view} />
          </CardContent>
        </Card>
      </Stack>
    </Layout>
  );
}
