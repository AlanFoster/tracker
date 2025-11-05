import React, {ReactNode} from 'react'
import {useAppSelector} from '@javascript/store'
import {
    Alert,
    Box,
    Container,
    createTheme,
    IconButton,
    styled,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        console.log(
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

const Offset = styled('div')(({theme}) => theme.mixins.toolbar);

export const Layout = ({children}: { children: ReactNode }) => {
    const flash = useAppSelector((state) => state.flash)

    return (
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <AppBar component="nav">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{flexGrow: 1, display: {sm: 'block'}}}
                        >
                            Tracker
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Offset/>
                <Container maxWidth="lg">
                    <Box pt={4}>
                        {flash.success &&
                            <Box mb={2}><Alert variant='filled' severity='success'>{flash.success}</Alert></Box>}
                        {flash.notice &&
                            <Box mb={2}><Alert variant='filled' severity='info'>{flash.notice}</Alert></Box>}
                        {flash.error &&
                            <Box mb={2}><Alert variant='filled' severity='error'>{flash.error}</Alert></Box>}

                        {children}
                    </Box>
                </Container>
            </ThemeProvider>
        </ErrorBoundary>
    )
}
