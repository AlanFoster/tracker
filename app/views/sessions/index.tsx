import { Layout } from '@javascript/components';
import SessionCard from '@javascript/components/SessionCard';
import { useAppSelector } from '@javascript/store';
import { Box, Link, Typography } from '@mui/material';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import SessionModalForm from './SessionModalForm';
import SessionsSummary from './SessionsSummary';

export default function SessionsIndex() {
  const { sessions, newSessionPath, createSessionModal, sessionSummary }
    = useContent() as any;
  const { visit } = useContext(NavigationContext);
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4">Overview</Typography>
        <SessionModalForm
          sessionForm={createSessionModal.newSessionForm}
          showModal={createSessionModal.showModal}
          validationErrors={validationErrors}
          onClose={() => visit('/')}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <SessionsSummary {...sessionSummary} />
        </Box>
      </Box>

      <Box>
        <Typography variant="h5">Sessions</Typography>

        {sessions.length === 0
          ? (
              <Typography>
                No sessions created yet.
                {' '}
                <Link href={newSessionPath} data-sg-visit>
                  Create your first session.
                </Link>
              </Typography>
            )
          : (
              <Link href={newSessionPath} data-sg-visit>
                New Session
              </Link>
            )}

        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </Box>
    </Layout>
  );
}
