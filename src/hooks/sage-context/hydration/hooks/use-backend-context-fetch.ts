
import { useEffect } from 'react';
import { fetchBackendContext } from '../utils/backend-fetch';
import { BackendContextState } from '../types';

/**
 * Hook to fetch context data from backend
 */
export function useBackendContextFetch(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  authLoading: boolean,
  setBackendContext: React.Dispatch<React.SetStateAction<BackendContextState>>,
  createFallbackFn: (userId: string | null, orgId: string | null, orgSlug: string | null) => any
) {
  useEffect(() => {
    // Skip if we don't have the necessary IDs yet
    if (!userId || !orgId || authLoading) {
      console.log("⏳ Waiting for auth data before fetching context", { userId, orgId, authLoading });
      return;
    }

    let isMounted = true;
    setBackendContext(prev => ({ ...prev, isLoading: true }));
    
    fetchBackendContext(
      userId,
      orgId,
      orgSlug,
      (context) => {
        if (!isMounted) return;
        
        setBackendContext({
          userContext: context.user || null,
          orgContext: context.org || null,
          isLoading: false,
          error: null,
          timedOut: false
        });
      },
      (error) => {
        if (!isMounted) return;
        
        setBackendContext(prev => {
          const fallbacks = createFallbackFn(userId, orgId, orgSlug);
          return { 
            ...prev, 
            isLoading: false,
            userContext: prev.userContext || fallbacks.userContext,
            orgContext: prev.orgContext || fallbacks.orgContext,
            error: error
          };
        });
      }
    );
    
    return () => {
      isMounted = false;
    };
  }, [userId, orgId, orgSlug, authLoading, setBackendContext, createFallbackFn]);
}
