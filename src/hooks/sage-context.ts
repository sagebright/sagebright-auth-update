
import { useSageContextReadiness } from './sage-context/use-sage-context-readiness';
import { useContextHydration } from './sage-context/hydration';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { buildSageContext } from '@/lib/context/buildSageContext';

/**
 * Hook to access the unified Sage context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useSageContextWithReadiness(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean,
  voiceParam: string | null = null
) {
  // Use the enhanced readiness hook
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    isSessionUserReady,
    voiceParam
  );

  return {
    ...contextReadiness,
    
    // Add context-specific helpers
    isFullyHydrated: contextReadiness.isReadyToSend && 
                     contextReadiness.isBackendContextReady &&
                     !contextReadiness.blockers.length,
    
    contextSources: {
      auth: 'auth-context',
      user: contextReadiness.isUserMetadataReady ? 'backend-context' : 'pending',
      org: contextReadiness.isOrgMetadataReady ? 'backend-context' : 'pending',
      voice: contextReadiness.isVoiceReady ? 'param' : 'pending'
    }
  };
}

/**
 * Hook to access the unified Sage context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useSageContext() {
  const { userId, orgId, orgSlug, user: currentUserData, loading: authLoading } = useAuth();
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  useEffect(() => {
    // If auth is still loading or no userId or orgId, don't fetch context yet
    if (authLoading || !userId || !orgId) {
      return;
    }

    let isMounted = true;
    
    // Set a timeout to detect if context is taking too long to load
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('⚠️ Context fetch timed out');
        setTimedOut(true);
        setFallbackMessage("Some context information is taking too long to load. " +
                          "You can continue with limited personalization.");
      }
    }, 10000); // 10 second timeout
    
    const fetchContext = async () => {
      try {
        setLoading(true);
        console.log('🌟 Fetching unified context via buildSageContext');
        
        const contextData = await buildSageContext(
          userId,
          orgId,
          orgSlug,
          currentUserData
        );
        
        if (isMounted) {
          console.log('✅ Context successfully fetched', {
            hasUser: !!contextData?.user,
            hasOrg: !!contextData?.org,
            timestamp: new Date().toISOString()
          });
          
          setContext(contextData);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error fetching context:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching context'));
          setFallbackMessage("Unable to load your personalized context. Some features may be limited.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContext();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [userId, orgId, orgSlug, currentUserData, authLoading]);

  return {
    context,
    loading,
    error,
    timedOut,
    fallbackMessage,
    userContext: context?.user || null,
    orgContext: context?.org || null,
    voiceConfig: context?.voiceConfig || null,
    isReady: !loading && !error && !!context
  };
}

export { useContextHydration };
export type { SageContextReadiness } from './sage-context/types';
export { useSageContextReadiness };
