import React from 'react';
import {useAppSelector} from '@javascript/applications/login/store';
import {
  Box,
  Card,
  CardContent, CardHeader,
  Stack,
} from '@mui/material';
import {useContent} from '@thoughtbot/superglue';
import {Form, SubmitButton, TextField} from "@javascript/components/Inputs";
import useVisitFormSubmit from "@javascript/components/useVisitFormSubmit";
import {Layout} from "@javascript/components/Layout";

export default function UserSessionsIndex() {
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const {editUserForm}
    = useContent() as any;
  const {form, extras, inputs} = editUserForm;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  return (
    <Layout>
      <Card>
        <CardHeader title='Update Profile'></CardHeader>
        <CardContent>
          <Box
          >
            <Form
              {...form}
              {...handleSubmit}
              extras={extras}
              validationErrors={validationErrors}
            >
              <Stack spacing={2} paddingTop={1}>
                <TextField
                  {...inputs.emailAddress}
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
                  {...inputs.displayName}
                  label="Display Name"
                  errorKey="display_name"
                />
                <SubmitButton
                  variant="contained"
                  {...inputs.submit}
                  loading={isLoading}
                />
              </Stack>
            </Form>
          </Box>
        </CardContent>
      </Card>
    </Layout>
  );
}
