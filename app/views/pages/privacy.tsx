import {
  Box,
  Container,
  createTheme,
  Divider,
  ThemeProvider,
  Typography,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function PagesPrivacy() {
  const { appName, contactEmail } = useContent();
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Container component="main" maxWidth="md">
        <Box sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
          <Typography variant="h4" gutterBottom>
            Privacy Policy
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last updated: January 1, 2026
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              <strong>{appName}</strong>
              {' '}
              uses Google OAuth for user
              authentication.
            </Typography>

            <Typography variant="h6">Information We Collect</Typography>
            <Typography>
              When you sign in with Google, we collect basic profile information,
              including your name, email address, profile picture, and Google
              account ID.
            </Typography>

            <Typography variant="h6">How We Use Information</Typography>
            <Typography>
              We use this information only to authenticate users and provide account
              access.
            </Typography>

            <Typography variant="h6">Data Sharing</Typography>
            <Typography>
              We do not sell or share your personal information with third parties.
            </Typography>

            <Typography variant="h6">Data Security</Typography>
            <Typography>
              We take reasonable measures to protect user data.
            </Typography>

            <Typography variant="h6">Data Deletion</Typography>
            <Typography>
              You may revoke access at any time through your Google Account settings
              or request data deletion by contacting us at
              {' '}
              <strong>{contactEmail}</strong>
              .
            </Typography>

            <Typography variant="h6">Google API Services</Typography>
            <Typography>
              Our use of information received from Google APIs complies with the
              Google API Services User Data Policy, including the Limited Use
              requirements.
            </Typography>

            <Typography variant="h6">Contact</Typography>
            <Typography>
              If you have questions about this Privacy Policy, contact us at
              {' '}
              <strong>{contactEmail}</strong>
              .
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
