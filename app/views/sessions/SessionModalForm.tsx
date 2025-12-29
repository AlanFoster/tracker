import { Form, SubmitButton, TextField } from '@javascript/components/Inputs';
import useVisitFormSubmit from '@javascript/components/useVisitFormSubmit';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import React from 'react';

export default function SessionModalForm({
  sessionForm,
  validationErrors,
  showModal,
  onClose,
}) {
  const { form, extras, inputs } = sessionForm;
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!showModal) {
    return undefined;
  }

  return (
    showModal && (
      <Dialog
        open={showModal}
        onClose={onClose}
        fullScreen={fullScreen}
        slotProps={{
          paper: {
            sx: {
              minWidth: { xs: '90vw', sm: 500 },
            },
          },
        }}
      >
        {fullScreen
          && (
            <AppBar position="relative">
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6">New Session</Typography>
              </Toolbar>
            </AppBar>
          )}

        {!fullScreen && <DialogTitle>New Session</DialogTitle>}
        <DialogContent>
          <Form
            {...form}
            {...handleSubmit}
            extras={extras}
            validationErrors={validationErrors}
          >
            <Stack spacing={2} paddingTop={1}>
              <TextField
                {...inputs.description}
                label="Description (Optional)"
                errorKey="description"
              />
              <SubmitButton variant="contained" {...inputs.submit} loading={isLoading} />
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}
