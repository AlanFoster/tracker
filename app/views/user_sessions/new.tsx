import React, {useContext} from 'react';
import {useAppSelector} from '@javascript/applications/login/store';
import {
  Alert,
  ThemeProvider,
  Avatar,
  Container,
  Box,
  Stack,
  Typography,
  createTheme
} from '@mui/material';
import {useContent} from '@thoughtbot/superglue';
import {Form, PasswordField, SubmitButton, TextField} from "@javascript/components/Inputs";
import CssBaseline from '@mui/material/CssBaseline';
import useVisitFormSubmit from "@javascript/components/useVisitFormSubmit";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function UserSessionsIndex() {
  const flash = useAppSelector((state) => state.flash)
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const {userSessionForm, forgotPasswordPath}
    = useContent() as any;
  const {form, extras, inputs} = userSessionForm;
  const validationErrors = useAppSelector(
    state => state.flash.postFormErrors,
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>

      <Container component="main" maxWidth="xs">
        <Box sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        >
          <Avatar sx={{m: 1, bgcolor: "primary.main"}}>
            <LockOutlinedIcon/>
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
                sx={{mt: 3, mb: 2}}
              />
            </Stack>
          </Form>
          {/*<a href={forgotPasswordPath}>Forgot password</a>*/}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
