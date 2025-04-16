
import { useMemo } from 'react';
import { useAskSageRouteProtection } from './use-route-protection';
import { useSageSessionStability } from './use-session-stability';

/**
 * Comprehensive guard for Ask Sage route and interactions
 */
export function useAskSageGuard() {
  const { protectionActive, isRedirectAllowed } = useAskSageRouteProtection();
  const { 
    sessionStable, 
    readinessBlockers,
    isContextReady 
  } = useSageSessionStability();

  // Combine protection and stability checks
  const guardState = useMemo(() => {
    const canInteract = sessionStable && isContextReady;
    const isProtected = protectionActive;

    return {
      canInteract,
      isProtected,
      readinessBlockers,
      shouldRender: canInteract && !isProtected,
    };
  }, [sessionStable, isContextReady, protectionActive, readinessBlockers]);

  return {
    ...guardState,
    isRedirectAllowed
  };
}
