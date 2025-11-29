import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-red-500/20 z-[9999]">
          <div className="bg-red-900 text-white p-8 rounded-lg shadow-2xl max-w-md">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>Something went wrong</span>
            </h1>
            <p className="mb-4 text-red-200">
              An error occurred in the NUI interface. Please check the F8 console for details.
            </p>
            {this.state.error && (
              <div className="bg-black/30 p-4 rounded text-sm font-mono text-red-300 overflow-auto max-h-40">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 w-full bg-red-700 hover:bg-red-600 py-2 px-4 rounded transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
