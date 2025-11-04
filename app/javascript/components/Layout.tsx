import React, {ReactNode} from 'react'
import {useAppSelector} from '@javascript/store'
import {Box, Container} from "@mui/material";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
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

export const Layout = ({children}: { children: ReactNode }) => {
    const flash = useAppSelector((state) => state.flash)

    return (
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <Container maxWidth="lg">

                {flash.success && <p>{flash.success}</p>}
                {flash.notice && <p>{flash.notice}</p>}
                {flash.error && <p>{flash.error}</p>}

                {children}
            </Container>
        </ErrorBoundary>
    )
}
