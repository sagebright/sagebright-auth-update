
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleApiError } from '@/lib/handleApiError';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our error handling system
    handleApiError(error, {
      context: 'ErrorBoundary',
      showToast: false,
    });
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise use default
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-accent1 mb-4" />
          <h2 className="text-2xl font-bold text-charcoal mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We're having trouble displaying this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
