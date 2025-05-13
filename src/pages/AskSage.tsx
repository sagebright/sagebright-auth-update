
import React, { useEffect } from 'react';
import { AskSageContainer } from '@/components/ask-sage/AskSageContainer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContext } from '@/hooks/sage-context';
import { toast } from '@/components/ui/use-toast';

const AskSage = () => {
  const { loading } = useAuth();
  const sageContext = useSageContext();

  useEffect(() => {
    console.log("🌟 AskSage page mounted", { 
      authLoading: loading,
      contextLoading: sageContext.loading,
      contextReady: sageContext.isReady
    });
    
    // Show notification for backend API issues
    if (sageContext.error) {
      console.warn("⚠️ Backend API error:", sageContext.error);
      toast({
        title: "Backend connection issue",
        description: "Unable to connect to the backend. Some features may be limited.",
        duration: 5000,
      });
    }
    
    // Show notification for backend timeout
    if (sageContext.timedOut) {
      console.warn("⏱️ Backend context timed out");
      toast({
        title: "Loading took too long",
        description: sageContext.fallbackMessage || "Some data couldn't load in time. You can continue with limited features.",
        duration: 5000,
      });
    }
  }, [loading, sageContext.loading, sageContext.isReady, sageContext.error, sageContext.timedOut, sageContext.fallbackMessage]);

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
