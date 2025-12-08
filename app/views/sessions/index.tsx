import { Layout } from '@javascript/components';
import SessionCard from '@javascript/components/SessionCard';
import { useAppSelector } from '@javascript/store';
import { Box, Link, TablePagination, Typography } from '@mui/material';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import SessionModalForm from './SessionModalForm';
import SessionsSummary from './SessionsSummary';

export default function SessionsIndex() {
  const { sessions, newSessionPath, createSessionModal, sessionSummary }
    = useContent() as any;
  const { visit, navigateTo, pageKey } = useContext(NavigationContext);
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    const url = new URL(sessions.links.self, window.location.origin);
    url.searchParams.set('page', (newPage + 1).toString());
    visit(
      `${url.pathname}?${url.searchParams.toString()}`,
      {
        method: 'GET',
        pageKey,
      },
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newPerPage = event.target.value;
    const url = new URL(sessions.links.self, window.location.origin);
    url.searchParams.set('page', '0');
    url.searchParams.set('per_page', newPerPage);
    visit(
      `${url.pathname}?${url.searchParams.toString()}`,
      {
        method: 'GET',
        pageKey,
      },
    );
  };

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4">Overview</Typography>
          {createSessionModal.showModal &&
              <SessionModalForm
                  sessionForm={createSessionModal.newSessionForm}
                  showModal={createSessionModal.showModal}
                  validationErrors={validationErrors}
                  onClose={() => {
                    visit(createSessionModal.backPath, {
                        pageKey
                    })
                  }}
              />
          }
        <Box display="flex" justifyContent="center" alignItems="center">
          <SessionsSummary {...sessionSummary} />
        </Box>
      </Box>

      <Box>
        <Typography variant="h5">Sessions</Typography>

        {sessions.meta.count === 0
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

        <TablePagination
          component="div"
          count={sessions.meta.totalItems}
          page={sessions.meta.currentPage - 1}
          rowsPerPage={sessions.meta.perPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {sessions.data.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}

        <TablePagination
          component="div"
          count={sessions.meta.totalItems}
          page={sessions.meta.currentPage - 1}
          rowsPerPage={sessions.meta.perPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Layout>
  );
}
