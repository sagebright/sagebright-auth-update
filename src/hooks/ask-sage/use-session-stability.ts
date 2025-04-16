
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/sage-context';

/**
 * Monitor session stability for Ask Sage interactions
 */
export function useSageSessionStability() {
  const { 
    user, 
    userId, 
    orgId, 
    loading: authLoading 
  } = useAuth();

  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    // Assuming orgSlug is part of the context
    user?.user_metadata?.org_slug ?? null, 
    user,
    authLoading,
    !!user,
    // Voice param would typically come from a hook
    'default'
  );

  const [sessionStable, setSessionStable] = useState(false);

  useEffect(() => {
    // Determine session stability based on comprehensive readiness checks
    const isStable = 
      !authLoading && 
      contextReadiness.isSessionStable && 
      contextReadiness.isReadyToRender;

    setSessionStable(isStable);

    if (isStable) {
      console.log('✅ Sage Session Stabilized', {
        userId,
        orgId,
        blockers: contextReadiness.blockers
      });
    } else if (contextReadiness.blockers.length > 0) {
      console.warn('🚧 Session Stability Blockers:', contextReadiness.blockers);
    }
  }, [
    authLoading, 
    contextReadiness.isSessionStable, 
    contextReadiness.isReadyToRender,
    contextReadiness.blockers,
    userId,
    orgId
  ]);

  return {
    sessionStable,
    readinessBlockers: contextReadiness.blockers,
    isContextReady: contextReadiness.isContextReady
  };
}
