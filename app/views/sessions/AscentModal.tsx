import { Flash } from '@javascript/applications/main/components/Layout';
import { useAppSelector } from '@javascript/applications/main/store';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import AscentForm from '@views/ascents/AscentForm';
import React from 'react';

export default function SessionModalForm({
  ascentForm,
  validationErrors,
  showModal,
  onClose,
}) {
  const flash = useAppSelector(state => state.flash);
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
              paddingBottom: '100px',
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
                <Typography variant="h6">{ascentForm.title}</Typography>
              </Toolbar>
            </AppBar>
          )}

        {!fullScreen && <DialogTitle>{ascentForm.title}</DialogTitle>}
        <Flash flash={flash} />
        <AscentForm
          ascentForm={ascentForm}
          validationErrors={validationErrors}
          onCancel={onClose}
          slots={{
            content: DialogContent,
            actions: DialogActions,
          }}
          slotProps={{
            actions: {
              sx: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#393939',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
                gap: 1,
              },
            },
          }}
        />
      </Dialog>
    )
  );
}
