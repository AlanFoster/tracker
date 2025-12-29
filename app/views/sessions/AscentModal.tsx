import {Dialog, DialogContent, DialogTitle, IconButton, Toolbar, Typography, useMediaQuery} from '@mui/material';
import AscentForm from '@views/ascents/AscentForm';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import CloseIcon from '@mui/icons-material/Close';


export default function SessionModalForm({
  ascentForm,
  validationErrors,
  showModal,
  onClose,
}) {
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
        {fullScreen &&
          <AppBar position="relative">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">{ascentForm.title}</Typography>
            </Toolbar>
          </AppBar>
        }

        {!fullScreen && <DialogTitle>{ascentForm.title}</DialogTitle>}
        <DialogContent>
          <AscentForm
            ascentForm={ascentForm}
            validationErrors={validationErrors}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>
    )
  );
}
