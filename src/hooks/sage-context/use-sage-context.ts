
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { hydrateSageContext } from '@/lib/api/sageContextApi';

/**
 * Hook to access the unified Sage context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useSageContext() {
  const { userId, orgId, orgSlug, user: currentUserData, loading: authLoading } = useAuth();
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hydrationAttempts, setHydrationAttempts] = useState(0);
  const [lastHydrationTime, setLastHydrationTime] = useState<number | null>(null);

  // Add timeout handling
  const [timedOut, setTimedOut] = useState(false);
  
  useEffect(() => {
    // If auth is still loading or no userId or orgId, don't fetch context yet
    if (authLoading || !userId || !orgId) {
      return;
    }

    let isMounted = true;
    let timeoutId: number | null = null;
    
    const fetchContext = async () => {
      try {
        setLoading(true);
        setHydrationAttempts(prev => prev + 1);
        
        // Set a timeout for context fetching (5 seconds)
        timeoutId = window.setTimeout(() => {
          if (isMounted) {
            console.warn('⚠️ Context hydration timed out after 5 seconds');
            setTimedOut(true);
            setLoading(false);
          }
        }, 5000);
        
        console.log('🌟 Fetching unified context via hydrateSageContext');
        
        const contextData = await hydrateSageContext(
          userId,
          orgId,
          orgSlug
        );
        
        // Clear the timeout since we got a response
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (isMounted) {
          if (contextData) {
            console.log('✅ Context successfully fetched', {
              hasUser: !!contextData.user,
              hasOrg: !!contextData.org,
              timestamp: new Date().toISOString()
            });
            
            setContext(contextData);
            setError(null);
            setLastHydrationTime(Date.now());
          } else {
            console.error('❌ Context hydration returned null');
            setError(new Error('Context hydration failed'));
          }
          
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching context:', err);
        
        // Clear the timeout if there's an error
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching context'));
          setLoading(false);
        }
      }
    };

    fetchContext();

    return () => {
      isMounted = false;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [userId, orgId, orgSlug, authLoading]);

  return {
    context,
    loading,
    error,
    timedOut,
    userContext: context?.user || null,
    orgContext: context?.org || null,
    voiceConfig: context?.voiceConfig || null,
    isReady: !loading && !error && !!context,
    hydrationAttempts,
    lastHydrationTime,
    // Provide a fallback message when timed out
    fallbackMessage: timedOut ? 
      "I'm sorry, but we're having trouble loading your information. You can continue, but some personalized features might be limited." : 
      null
  };
}

export default useSageContext;
