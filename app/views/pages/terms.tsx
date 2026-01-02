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
            Terms of Service
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last updated: January 1, 2026
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              By using
              {' '}
              <strong>{appName}</strong>
              , you agree to the following terms.
            </Typography>

            <Typography variant="h6">Use of the Service</Typography>
            <Typography>
              You may use this service only for lawful purposes and in accordance with these terms.
            </Typography>

            <Typography variant="h6">Accounts</Typography>
            <Typography>
              If you sign in using Google OAuth, you are responsible for maintaining the security of your account.
            </Typography>

            <Typography variant="h6">Data</Typography>
            <Typography>
              Your use of the service is also governed by our Privacy Policy.
            </Typography>

            <Typography variant="h6">Availability</Typography>
            <Typography>
              We may modify, suspend, or discontinue the service at any time without notice.
            </Typography>

            <Typography variant="h6">Limitation of Liability</Typography>
            <Typography>
              The service is provided “as is” without warranties of any kind. We are not liable for any damages arising
              from your use of the service.
            </Typography>

            <Typography variant="h6">Termination</Typography>
            <Typography>
              We may suspend or terminate access to the service if these terms are violated.
            </Typography>

            <Typography variant="h6">Contact</Typography>
            <Typography>
              For questions about these Terms, contact:
              {' '}
              <strong>{contactEmail}</strong>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
