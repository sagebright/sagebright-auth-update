
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { buildSageContext } from '@/lib/buildSageContext';

/**
 * Hook to access the unified context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useContext() {
  const { userId, orgId, orgSlug, user: currentUserData, loading: authLoading } = useAuth();
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If auth is still loading or no userId or orgId, don't fetch context yet
    if (authLoading || !userId || !orgId) {
      return;
    }

    let isMounted = true;
    
    const fetchContext = async () => {
      try {
        setLoading(true);
        console.log('🌟 Fetching unified context from buildSageContext');
        
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
    };
  }, [userId, orgId, orgSlug, currentUserData, authLoading]);

  return {
    context,
    loading,
    error,
    userContext: context?.user || null,
    orgContext: context?.org || null,
    isReady: !loading && !error && !!context
  };
}

export default useContext;
