import {
  Box,
  Button,
  Container,
  createTheme,
  Link,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export function Layout({ children }: React.PropsWithChildren) {
  const { termsPath, privacyPath, signInPath } = useContent();

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Box
              component="div"
              sx={{ flexGrow: 1, display: { sm: 'block' } }}
            >
              <Link
                href="/"
                data-sg-visit
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <Typography
                  variant="h6"
                >
                  Tracker
                </Typography>
              </Link>
            </Box>
            <Button
              component="a"
              href={signInPath}
              variant="outlined"
            >
              Sign In
            </Button>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            marginBottom: '2rem',
          }}
        >
          <Offset />
          <Box sx={{ flexGrow: 1, pt: 4 }}>
            {children}
          </Box>

          <Box
            component="footer"
            sx={{
              py: 2,
              px: 4,
              mt: 'auto',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Link href={termsPath} underline="hover">
              Terms of Service
            </Link>
            <Link href={privacyPath} underline="hover">
              Privacy Policy
            </Link>
          </Box>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
