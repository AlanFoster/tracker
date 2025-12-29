import { useAppSelector } from '@javascript/applications/main/store';
import { AscentBlockChart } from '@javascript/components/AscentBlocks';
import { ascentsAsEmojis } from '@javascript/components/Emoji';
import { Layout } from '@javascript/components/Layout';
import ShareButton from '@javascript/components/ShareButton';
import {
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
import AscentsSummary from './AscentsSummary';

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

        <AscentsSummary ascentCounts={session.summary.ascentCounts} />

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
            label="Share"
            onShare={() =>
              ascentsAsEmojis(session.ascents)}
          />
        </Stack>
      </Stack>
    </Layout>
  );
}
