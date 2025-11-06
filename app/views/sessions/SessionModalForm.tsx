import { Form, SubmitButton, TextField } from '@javascript/components';
import useFormSubmitState from '@javascript/components/useFormSubmitState';
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import React from 'react';

export default function SessionModalForm({
  sessionForm,
  validationErrors,
  showModal,
  onClose,
}) {
  const { form, extras, inputs } = sessionForm;
  const [isLoading, handleSubmit] = useFormSubmitState();

  if (!showModal) {
    return undefined;
  }

  return (
    showModal && (
      <Dialog open={showModal} onClose={onClose}>
        <DialogTitle>New Session</DialogTitle>
        <DialogContent>
          <>
            {/* <pre>{JSON.stringify(sessionForm, null, 4)}</pre> */}
            {/* <pre>{JSON.stringify(validationErrors, null, 4)}</pre> */}

            <Form
              {...form}
              {...handleSubmit}
              extras={extras}
              validationErrors={validationErrors}
              data-sg-visit
            >
              <Stack spacing={2} paddingTop={1} width={400}>
                <TextField
                  {...inputs.description}
                  label="Description"
                  errorKey="description"
                />
                <SubmitButton variant="contained" {...inputs.submit} loading={isLoading} />
              </Stack>
            </Form>
          </>
        </DialogContent>
      </Dialog>
    )
  );
}
