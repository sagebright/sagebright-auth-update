
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { hydrateSageContext } from '@/lib/api/sageContextApi';
import { SageContext } from '@/types/chat';

/**
 * Hook to access the unified Sage context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useSageContext() {
  console.log("🧠 useSageContext hook initialized");
  
  const { userId, orgId, orgSlug, user: currentUserData, loading: authLoading } = useAuth();
  const [context, setContext] = useState<SageContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hydrationAttempts, setHydrationAttempts] = useState(0);
  const [lastHydrationTime, setLastHydrationTime] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  
  // Timeout for context hydration (5 seconds)
  const HYDRATION_TIMEOUT = 5000;
  
  useEffect(() => {
    console.log("🔄 useSageContext effect triggered", {
      authLoading,
      userId,
      orgId,
      hasOrgSlug: !!orgSlug,
      hasUserData: !!currentUserData
    });
    
    // If auth is still loading or no userId or orgId, don't fetch context yet
    if (authLoading || !userId || !orgId) {
      console.log("⏳ Auth loading or missing IDs, skipping context fetch", {
        authLoading,
        hasUserId: !!userId,
        hasOrgId: !!orgId
      });
      return;
    }

    let isMounted = true;
    
    const fetchContext = async () => {
      try {
        console.log("🚀 Starting context fetch with hydrateSageContext", {
          userId,
          orgId,
          orgSlug,
          timeout: HYDRATION_TIMEOUT
        });
        
        setLoading(true);
        setHydrationAttempts(prev => prev + 1);
        
        console.log('🌟 Fetching unified context via hydrateSageContext');
        
        const contextData = await hydrateSageContext(
          userId,
          orgId,
          orgSlug,
          HYDRATION_TIMEOUT
        );
        
        if (isMounted) {
          if (contextData) {
            // Check if this was a timeout fallback
            if (contextData._meta?.timeout) {
              setTimedOut(true);
              console.warn('⚠️ Context hydration timed out, using fallback data');
            } else {
              console.log('✅ Context successfully fetched', {
                hasUser: !!contextData.user,
                hasOrg: !!contextData.org,
                timestamp: new Date().toISOString()
              });
            }
            
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
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching context'));
          setLoading(false);
        }
      }
    };

    console.log("📞 Calling fetchContext from useSageContext");
    fetchContext();

    return () => {
      console.log("🧹 Cleaning up useSageContext effect");
      isMounted = false;
    };
  }, [userId, orgId, orgSlug, authLoading, HYDRATION_TIMEOUT]);

  const result = {
    context,
    loading,
    error,
    timedOut,
    userContext: context?.user || null,
    orgContext: context?.org || null,
    voiceConfig: context?._meta?.voiceConfig || null,
    isReady: !loading && !error && !!context,
    hydrationAttempts,
    lastHydrationTime,
    // Provide a fallback message when timed out
    fallbackMessage: timedOut ? 
      "I'm sorry, but we're having trouble loading your information. You can continue, but some personalized features might be limited." : 
      null
  };

  console.log("📤 useSageContext returning", {
    loading,
    hasError: !!error,
    isReady: result.isReady,
    hydrationAttempts,
    timedOut,
    hasContext: !!context
  });

  return result;
}

export default useSageContext;
