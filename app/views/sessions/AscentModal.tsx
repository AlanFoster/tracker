import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import AscentForm from '@views/ascents/AscentForm';
import React from 'react';

export default function SessionModalForm({
  ascentForm,
  validationErrors,
  showModal,
  onClose,
}) {
  if (!showModal) {
    return undefined;
  }

  return (
    showModal && (
      <Dialog open={showModal} onClose={onClose}>
        <DialogTitle>{ascentForm.title}</DialogTitle>
        <DialogContent>
          <>
            {/* <pre>{JSON.stringify(sessionForm, null, 4)}</pre> */}
            {/* <pre>{JSON.stringify(validationErrors, null, 4)}</pre> */}

            <AscentForm
              ascentForm={ascentForm}
              validationErrors={validationErrors}
            />
          </>
        </DialogContent>
      </Dialog>
    )
  );
}
