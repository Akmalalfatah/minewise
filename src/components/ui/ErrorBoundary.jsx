import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {}

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
                    <div className="text-gray-800 text-xl font-semibold mb-2">
                        Something went wrong
                    </div>
                    <div className="text-gray-500 text-sm">
                        Please reload the page or contact administrator.
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
