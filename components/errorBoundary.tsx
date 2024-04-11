import React, { ErrorInfo } from "react"

interface Props {
    children?: React.JSX.Element
    fallback: React.JSX.Element
}

interface State {
    hasError: boolean
}

/**
 * Error boundary for React components
 */
class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: {
        fallback: React.JSX.Element
        children: React.JSX.Element
    }) {
        super(props)
        this.state = { hasError: false }
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children
    }
}

export default ErrorBoundary
