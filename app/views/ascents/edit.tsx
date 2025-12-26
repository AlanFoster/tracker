import { useAppSelector } from '@javascript/applications/main/store';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';
import AscentForm from './AscentForm';

export default function SessionsIndex() {
  const { editAscentForm } = useContent() as any;
  const flash = useAppSelector(state => state.flash);
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  return (
    <Dialog open={true}>
      <DialogTitle>Edit Ascent</DialogTitle>
      <DialogContent>
        {flash.notice && <p>{flash.notice}</p>}
        {flash.alert && <p>{flash.alert}</p>}

        <AscentForm
          ascentForm={editAscentForm}
          validationErrors={validationErrors}
        />
      </DialogContent>
    </Dialog>
  );
}
