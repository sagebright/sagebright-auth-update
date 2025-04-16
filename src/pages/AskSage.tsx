
import React from 'react';
import { AskSageContainer } from '@/components/ask-sage/AskSageContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

const AskSage = () => {
  return (
    <ErrorBoundary fallback={
      <div className="p-4 bg-red-50 text-red-800 rounded-lg my-4">
        <h3 className="font-medium">Something went wrong loading Sage</h3>
        <p>Try refreshing the page or contact support if the issue persists.</p>
      </div>
    }>
      <AskSageContainer />
    </ErrorBoundary>
  );
};

export default AskSage;
