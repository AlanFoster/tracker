import { Layout } from '@javascript/applications/main/components/Layout';
import SessionCard from '@javascript/applications/main/components/SessionCard';
import { useAppSelector } from '@javascript/applications/main/store';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import {
  Box,
  Button,
  Card,
  CardContent,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useContext } from 'react';
import SessionModalForm from './SessionModalForm';
import SessionsSummary from './SessionsSummary';

export default function SessionsIndex() {
  const { sessions, newSessionPath, createSessionModal, sessionSummary }
    = useContent() as any;
  const { visit, pageKey } = useContext(NavigationContext);
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );
  const [view, setView] = React.useState('grid');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

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
        {createSessionModal.showModal
          && (
            <SessionModalForm
              sessionForm={createSessionModal.newSessionForm}
              showModal={createSessionModal.showModal}
              validationErrors={validationErrors}
              onClose={() => {
                visit(createSessionModal.backPath, {
                  pageKey,
                });
              }}
            />
          )}
        <SessionsSummary {...sessionSummary} />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        bgcolor="background.paper"
        mb={2}
      >
        <Typography variant="h5">Sessions</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            href={newSessionPath}
            variant="contained"
            startIcon={<AddIcon />}
            data-sg-visit
          >
            Add
          </Button>
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

      <Box>
        {sessionSummary.totalSessions === 0 && (
          <Card>
            <CardContent>
              <Typography mb={2}>
                No sessions created yet.
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  href={newSessionPath}
                  variant="contained"
                  startIcon={<AddIcon />}
                  data-sg-visit
                >
                  Create your first session.
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {sessionSummary.totalSessions > 0 && (
          <>
            <TablePagination
              component="div"
              count={sessions.meta.totalItems}
              page={sessions.meta.currentPage - 1}
              rowsPerPage={sessions.meta.perPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {sessions.data.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                view={view}
              />
            ))}

            <TablePagination
              component="div"
              count={sessions.meta.totalItems}
              page={sessions.meta.currentPage - 1}
              rowsPerPage={sessions.meta.perPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Layout>
  );
}
