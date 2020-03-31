import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        //log Error to Sentry or Equivalent
    }

    render() {
        if (this.state.hasError) {
            return <h1 className="text-center bg-dark text-light" style={{lineHeight: '100vh'}}>Something went wrong <i class="far fa-sad-cry"></i>. But we are on it! <i class="fas fa-wrench"></i></h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary