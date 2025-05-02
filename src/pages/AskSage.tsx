
import React, { useEffect } from 'react';
import { AskSageContainer } from '@/components/ask-sage/AskSageContainer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContext } from '@/hooks/sage-context';

const AskSage = () => {
  const { loading } = useAuth();
  const sageContext = useSageContext();

  useEffect(() => {
    console.log("🌟 AskSage page mounted", { 
      authLoading: loading,
      contextLoading: sageContext.loading,
      contextReady: sageContext.isReady
    });
  }, [loading, sageContext.loading, sageContext.isReady]);

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
