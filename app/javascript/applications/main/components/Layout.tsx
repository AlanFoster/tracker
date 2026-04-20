import { useAppSelector } from '@javascript/applications/main/store';
import { Form } from '@javascript/components/Inputs';
import {
  Alert,
  Box,
  Container,
  createTheme,
  IconButton,
  Link,
  Menu,
  MenuItem,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { useContent } from '@thoughtbot/superglue';
import { formatDistanceToNowStrict } from 'date-fns';
import React from 'react';
import UserAvatar from './UserAvatar';

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

function UserProfileMenu({ currentUser, profilePath }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef(null);
  const { form, extras } = currentUser.signoutForm;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = (e) => {
    if (isLoading)
      return;
    setIsLoading(true);
    formRef.current?.submit();
    e.stopPropagation();
  };

  return (
    <div>
      <UserAvatar
        slots={{
          iconButton: {
            'aria-label': 'account of current user',
            'aria-controls': 'menu-appbar',
            'aria-haspopup': 'true',
            'onClick': handleMenu,
          },
        }}
        user={currentUser}
      />
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* Hidden form that gets triggered for log out */}
        <Form ref={formRef} {...form} extras={extras} data-sg-remote />

        <MenuItem component="a" href={profilePath} data-sg-visit>
          Profile
        </MenuItem>

        <MenuItem component="button" onClick={handleSignOut} disabled={isLoading}>
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
}

export function Flash({ flash }) {
  const [, setTick] = React.useState(0);
  const [visibleAlerts, setVisibleAlerts] = React.useState({
    success: true,
    notice: true,
    alert: true,
    error: true,
  });

  // Reset visibility when flash content changes
  React.useEffect(() => {
    setVisibleAlerts({
      success: true,
      notice: true,
      alert: true,
      error: true,
    });
  }, [flash.notice, flash.success, flash.alert, flash.error, flash.createdAt]);

  // Update timer every second
  React.useEffect(() => {
    if (!flash.createdAt) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [flash.createdAt]);

  const handleClose = (alertType: string) => {
    setVisibleAlerts(prev => ({ ...prev, [alertType]: false }));
  };

  const timeAgo = flash.createdAt
    ? formatDistanceToNowStrict(new Date(flash.createdAt * 1000), { addSuffix: true })
    : '';

  return (
    <>
      {flash.success && visibleAlerts.success && (
        <Box mb={2}>
          <Alert
            variant="filled"
            severity="success"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose('success')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {flash.success}
          </Alert>
        </Box>
      )}
      {flash.notice && visibleAlerts.notice && (
        <Box mb={2}>
          <Alert
            variant="filled"
            severity="info"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose('notice')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {flash.notice}
            {flash.createdAt && (
              <Typography variant="caption" component="div" sx={{ opacity: 0.8 }}>
                ({timeAgo})
              </Typography>
            )}
          </Alert>
        </Box>
      )}
      {flash.alert && visibleAlerts.alert && (
        <Box mb={2}>
          <Alert
            variant="filled"
            severity="info"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose('alert')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {flash.alert}
          </Alert>
        </Box>
      )}
      {flash.error && visibleAlerts.error && (
        <Box mb={2}>
          <Alert
            variant="filled"
            severity="error"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose('error')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {flash.error}
          </Alert>
        </Box>
      )}
    </>
  );
}

export function Layout({ children }: React.PropsWithChildren) {
  const flash = useAppSelector(state => state.flash);
  const { currentUser, profilePath, statisticsPath, sessionsPath } = useContent();

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
              <Box display="flex" alignItems="center" gap={3}>
                <Link
                  href="/"
                  data-sg-visit
                  color="inherit"
                  underline="none"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  <Typography variant="h6">Tracker</Typography>
                </Link>
                {currentUser && (
                  <>
                    <Link
                      href={sessionsPath}
                      data-sg-visit
                      color="inherit"
                      underline="none"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      <Typography variant="body1">Sessions</Typography>
                    </Link>
                    <Link
                      href={statisticsPath}
                      data-sg-visit
                      color="inherit"
                      underline="none"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      <Typography variant="body1">Statistics</Typography>
                    </Link>
                  </>
                )}
              </Box>
            </Box>
            {currentUser && <UserProfileMenu currentUser={currentUser} profilePath={profilePath} />}
          </Toolbar>
        </AppBar>
        <Offset />
        <Container
          maxWidth="lg"
          sx={{
            minHeight: '100vh',
            marginBottom: '2rem',
          }}
        >
          <Box pt={4}>
            <Flash flash={flash} />

            {children}
          </Box>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
