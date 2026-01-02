import { Layout } from '@javascript/applications/public/components/Layout';
import { useAppSelector } from '@javascript/applications/public/store';
import { Form, PasswordField, SubmitButton, TextField } from '@javascript/components/Inputs';
import useVisitFormSubmit from '@javascript/components/useVisitFormSubmit';
import GoogleIcon from '@mui/icons-material/Google';
import HandymanIcon from '@mui/icons-material/Handyman';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';

const icons = {
  google_oauth2: <GoogleIcon />,
  developer: <HandymanIcon />,
};

export default function UserSessionsIndex() {
  const flash = useAppSelector(state => state.flash);
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  // , forgotPasswordPath
  const { userSessionForm, authProviders }
    = useContent() as any;
  const { form, extras, inputs } = userSessionForm;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  return (
    <Layout>
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {flash.success && (
          <Box mb={2}>
            <Alert variant="filled" severity="success">
              {flash.success}
            </Alert>
          </Box>
        )}
        {flash.notice && (
          <Box mb={2}>
            <Alert variant="filled" severity="info">
              {flash.notice}
            </Alert>
          </Box>
        )}
        {flash.alert && (
          <Box mb={2}>
            <Alert variant="filled" severity="info">
              {flash.alert}
            </Alert>
          </Box>
        )}
        {flash.error && (
          <Box mb={2}>
            <Alert variant="filled" severity="error">
              {flash.error}
            </Alert>
          </Box>
        )}
        <Form
          {...form}
          {...handleSubmit}
          extras={extras}
          validationErrors={validationErrors}
        >
          <Stack spacing={2} paddingTop={1} width={400}>
            <TextField
              {...inputs.emailAddress}
              label="Email address"
              errorKey="emailAddress"
            />
            <PasswordField
              {...inputs.password}
              label="Password"
              errorKey="password"
            />
            <SubmitButton
              variant="contained"
              {...inputs.submit}
              loading={isLoading}
              sx={{ mt: 3, mb: 2 }}
            />

            {authProviders.map(({ name, path, displayName }) => (
              <Button
                key={name}
                component="a"
                href={path}
                variant="outlined"
                role={undefined}
                loading={isLoading}
                startIcon={icons[name]}
                sx={{
                  'textTransform': 'none',
                  'fontWeight': 500,
                  'borderRadius': 1,
                  'px': 2,
                  'borderColor': '#5f6368',
                  'color': '#e8eaed',
                  'backgroundColor': '#202124',
                  '&:hover': {
                    backgroundColor: '#303134',
                    borderColor: '#8ab4f8',
                  },
                }}
              >
                Sign in with
                {' '}
                {displayName}
              </Button>
            ))}

          </Stack>
        </Form>
        {/* <a href={forgotPasswordPath}>Forgot password</a> */}
      </Box>
    </Layout>
  );
}
