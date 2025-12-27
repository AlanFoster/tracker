import { useAppSelector } from '@javascript/applications/main/store';
import {
  Alert,
  Box,
  Container,
  createTheme,
  IconButton,
  Menu,
  MenuItem,
  styled,
  ThemeProvider,
  Toolbar,
  Link,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { Form } from '@javascript/components/Inputs';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import {useContent} from "@thoughtbot/superglue";
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
  const [isLoading, setIsLoading] = React.useState(false)
  const formRef = React.useRef(null);
  const {form, extras} = currentUser.signoutForm;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = (e) => {
    if (isLoading) return;
    setIsLoading(true)
    formRef.current?.submit();
    e.stopPropagation();
  };

  return (
    <div>
    <UserAvatar
      slots={{
        iconButton: {
          'aria-label': "account of current user",
          'aria-controls': "menu-appbar",
          'aria-haspopup': "true",
          onClick: handleMenu
        }
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
      <Form ref={formRef} {...form} extras={extras} data-sg-remote/>

      {/*data-sg-visit*/}
      <MenuItem component='a' href={profilePath} >
        Profile
      </MenuItem>

      <MenuItem onClick={handleSignOut} disabled={isLoading}>
        Sign out
      </MenuItem>
    </Menu>
  </div>
  );
}

export function Layout({ children }: React.PropsWithChildren) {
  const flash = useAppSelector(state => state.flash);
  const { currentUser, profilePath } = useContent();

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
            </IconButton>
            <Box
              component="div"
              sx={{ flexGrow: 1, display: { sm: 'block' } }}
            >
              <Link
                href='/'
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
            {currentUser && <UserProfileMenu currentUser={currentUser } profilePath={profilePath} />}
          </Toolbar>
        </AppBar>
        <Offset />
        <Container maxWidth="lg">
          <Box pt={4}>
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
            {flash.error && (
              <Box mb={2}>
                <Alert variant="filled" severity="error">
                  {flash.error}
                </Alert>
              </Box>
            )}

            {children}
          </Box>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
