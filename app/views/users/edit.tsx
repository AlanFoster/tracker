import { Layout } from '@javascript/applications/main/components/Layout';
import { useAppSelector } from '@javascript/applications/public/store';
import { Form, SubmitButton, TextField } from '@javascript/components/Inputs';
import useVisitFormSubmit from '@javascript/components/useVisitFormSubmit';
import ConfirmDeleteRows from '@javascript/applications/main/components/ConfirmDeleteRows'
import ConfirmDelete from '@javascript/applications/main/components/ConfirmDelete'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { NavigationContext, useContent } from '@thoughtbot/superglue';
import React, { useMemo, useEffect, useContext, useState } from 'react';
import { formatDistanceToNowStrict, format } from 'date-fns';

export default function UserEdit() {
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const [isDownloadLoading, handleDownloadSubmit] = useVisitFormSubmit();
  const { editUserForm, downloadDataForm, bulkDeleteExportsForm, dataExports: initialDataExports, dataExportsPollingUrl }
    = useContent() as any;
  const { form: editForm, extras: editExtras, inputs: editInputs } = editUserForm;
  const { form: downloadForm, extras: downloadExtras, inputs: downloadInputs } = downloadDataForm;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );
  const { remote, pageKey } = useContext(NavigationContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedIdsForDeletion, setSelectedIdsForDeletion] = useState<number[]>([]);
  const [exportIdForDeletion, setExportIdForDeletion] = useState<number | null>(null);
  const [hasInflightExport, setHasInflightExport] = useState(false);

  const inflightExport = useMemo(() => {
    return initialDataExports?.find((exp: any) => exp.status === 'pending' || exp.status === 'processing');
  }, [initialDataExports]);

  useEffect(() => {
    setHasInflightExport(!!inflightExport);
  }, [inflightExport]);

  useEffect(() => {
    if (!inflightExport) return;

    const interval = setInterval(() => {
      remote(dataExportsPollingUrl, { pageKey });
    }, 2000);

    return () => clearInterval(interval);
  }, [inflightExport, remote, pageKey, dataExportsPollingUrl]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteExport = (exportId: number) => {
    setExportIdForDeletion(exportId);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedExports.map((exp: any) => exp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (exportId: number) => {
    setSelectedIds((prev) =>
      prev.includes(exportId)
        ? prev.filter((id) => id !== exportId)
        : [...prev, exportId]
    );
  };

  const paginatedExports = initialDataExports?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Queued';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader title="Update Profile"></CardHeader>
        <CardContent>
          <Box>
            <Form
              {...editForm}
              {...handleSubmit}
              extras={editExtras}
              validationErrors={validationErrors}
            >
              <Stack spacing={2} paddingTop={1}>
                <TextField
                  {...editInputs.emailAddress}
                  disabled
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  label="Email address"
                  errorKey="email_address"
                />
                <TextField
                  {...editInputs.displayName}
                  label="Display Name"
                  errorKey="display_name"
                />
                <SubmitButton
                  variant="contained"
                  {...editInputs.submit}
                  loading={isLoading}
                />
              </Stack>
            </Form>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Data Export"></CardHeader>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body2">
              Download all of your climbing data including sessions, ascents, and tags in JSON format.
            </Typography>
            <Box>
              <Form
                {...downloadForm}
                {...handleDownloadSubmit}
                extras={downloadExtras}
              >
                <SubmitButton
                  variant="contained"
                  disabled={hasInflightExport}
                  loading={isDownloadLoading || hasInflightExport}
                  data-testid="download-data-button"
                  {...downloadInputs.submit}
                />
              </Form>
            </Box>

            {initialDataExports && initialDataExports.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Export History
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {initialDataExports.length} export{initialDataExports.length !== 1 ? 's' : ''}
                    </Typography>
                    {selectedIds.length > 0 && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                          setSelectedIdsForDeletion(selectedIds)
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete {selectedIds.length}
                      </Button>
                    )}
                  </Box>
                </Box>

              {selectedIdsForDeletion.length > 0 &&
                  <ConfirmDeleteRows
                      deleteForm={bulkDeleteExportsForm}
                      ids={selectedIdsForDeletion}
                      onCancel={() => {
                        setSelectedIds([])
                      }}
                  />}

              {exportIdForDeletion !== null &&
                  <ConfirmDelete
                      deleteForm={initialDataExports.find((exp: any) => exp.id === exportIdForDeletion)?.deleteForm}
                      onCancel={() => {
                        setExportIdForDeletion(null)
                      }}
                  />}

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell padding="checkbox" sx={{ width: 48 }}>
                          <Checkbox
                            indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedExports.length}
                            checked={paginatedExports.length > 0 && selectedIds.length === paginatedExports.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date & Time</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedExports.map((exp: any) => (
                        <TableRow
                          key={exp.id}
                          sx={{
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIds.includes(exp.id)}
                              onChange={() => handleSelectRow(exp.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(exp.status)}
                              size="small"
                              color={getStatusColor(exp.status) === 'success' ? 'success' :
                                     getStatusColor(exp.status) === 'error' ? 'error' : 'default'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {formatDistanceToNowStrict(new Date(exp.created_at), { addSuffix: true })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(new Date(exp.created_at), 'MMM d, yyyy · h:mm a')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              {exp.status === 'completed' && exp.file_path && (
                                <Tooltip title="Download">
                                  <IconButton
                                    size="small"
                                    href={exp.downloadPath}
                                    component="a"
                                    data-testid={`download-export-${exp.id}`}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {exp.status === 'completed' && !exp.file_path && (
                                <Tooltip title="File expired">
                                  <IconButton size="small" disabled>
                                    <FileDownloadDoneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteExport(exp.id)}
                                  color="error"
                                  data-testid={`delete-export-${exp.id}`}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={initialDataExports.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Layout>
  );
}
