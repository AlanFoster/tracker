import { Layout } from '@javascript/components';
import { AscentBlockChart } from '@javascript/components/AscentBlocks';
import { colorsAsEmojis } from '@javascript/components/Emoji';
import ShareButton from '@javascript/components/ShareButton';
import { useAppSelector } from '@javascript/store';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import AscentFormModal from './AscentModal';
import ReportSummary from './AscentsSummary';

export default function SessionsShow() {
  const { session, ascentModal, backPath } = useContent() as any;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );
  const { visit } = useContext(NavigationContext);

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

        <Box display="flex" justifyContent="center" alignItems="center">
          <ReportSummary ascentCounts={session.summary.ascentCounts} />
        </Box>

        <Typography variant="h5">{session.title}</Typography>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AscentBlockChart ascents={session.ascents} />
          </CardContent>
        </Card>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" href={session.newAscentPath} data-sg-visit>
            New Ascent
          </Button>
          <ShareButton
            onShare={() =>
              colorsAsEmojis(session.ascents.map(ascent => ascent.color))}
          />
        </Stack>
      </Stack>
    </Layout>
  );
}
