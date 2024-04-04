import React, { ErrorInfo } from "react"

interface Props {
    children?: React.JSX.Element
    fallback: React.JSX.Element
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: {
        fallback: React.JSX.Element
        children: React.JSX.Element
    }) {
        super(props)
        this.state = { hasError: false }
    }

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            {
                console.log("???")
            }
            return this.props.fallback
        }

        return this.props.children
    }
}

export default ErrorBoundary
