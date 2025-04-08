
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
}

const PageErrorFallback = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
        <AlertTriangle className="h-16 w-16 mx-auto text-accent1 mb-4" />
        <h1 className="text-2xl font-bold text-charcoal mb-2">Oops! Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading this page.
        </p>
        <Button 
          variant="default" 
          onClick={handleRefresh}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh page
        </Button>
      </div>
    </div>
  );
};

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<PageErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
