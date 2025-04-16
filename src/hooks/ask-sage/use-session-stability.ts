
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/sage-context';

/**
 * Monitor session stability for Ask Sage interactions with enhanced recovery
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
    user?.user_metadata?.org_slug ?? null, 
    user,
    authLoading,
    !!user,
    'default'
  );

  const [sessionStable, setSessionStable] = useState(false);
  const [stableTimestamp, setStableTimestamp] = useState<number | null>(null);

  useEffect(() => {
    // Determine session stability with additional metadata checks
    const isStable = 
      !authLoading && 
      contextReadiness.isSessionStable && 
      contextReadiness.isReadyToRender &&
      !!user?.user_metadata; // Additional check for user metadata

    if (isStable && !sessionStable) {
      setStableTimestamp(Date.now());
      console.log('✅ Sage Session Stabilized', {
        userId,
        role: user?.user_metadata?.role || 'unknown',
        orgId,
        stableAt: new Date().toISOString(),
        blockers: contextReadiness.blockers
      });
    }

    setSessionStable(isStable);
  }, [
    authLoading, 
    contextReadiness.isSessionStable, 
    contextReadiness.isReadyToRender,
    contextReadiness.blockers,
    userId,
    orgId,
    user,
    sessionStable
  ]);

  return {
    sessionStable,
    stableTimestamp,
    readinessBlockers: contextReadiness.blockers,
    isContextReady: contextReadiness.isContextReady
  };
}
