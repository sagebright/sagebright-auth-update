
import { useMemo } from 'react';
import { useAskSageRouteProtection } from './use-route-protection';
import { useSageSessionStability } from './use-session-stability';

/**
 * Comprehensive guard for Ask Sage route and interactions
 * 
 * This hook combines route protection and session stability to provide
 * a unified API for determining when interaction with Sage is allowed
 * and when rendering should occur.
 */
export function useAskSageGuard() {
  // Route protection to prevent unwanted redirects during critical operations
  const { 
    protectionActive, 
    isRedirectAllowed, 
    protectionStartTime 
  } = useAskSageRouteProtection();
  
  // Session stability to ensure a consistent user experience
  const { 
    sessionStable, 
    readinessBlockers,
    isContextReady,
    stableTimestamp,
    stabilityTimeMs
  } = useSageSessionStability();

  // Combine protection and stability checks to determine interaction states
  const guardState = useMemo(() => {
    // Start a console group for guard state evaluation
    console.group('🛡️ Ask Sage Guard Evaluation');
    console.log('Timestamp:', new Date().toISOString());
    
    // Determine if interaction with Sage should be allowed
    const canInteract = sessionStable && isContextReady;
    
    // Determine if the route is currently under protection
    const isProtected = protectionActive;

    // Determine if Sage UI can be rendered
    const shouldRender = canInteract;
    
    // When content is ready but still under active protection
    const isProtectedButReady = canInteract && isProtected;
    
    // Calculate timing metrics
    const protectionTimeMs = protectionStartTime ? Date.now() - protectionStartTime : null;
    
    // Log state transitions for debugging
    console.log('Guard State:', {
      canInteract,
      isProtected,
      shouldRender,
      isProtectedButReady,
      timings: {
        protection: protectionTimeMs ? `${Math.round(protectionTimeMs / 1000)}s` : 'N/A',
        stability: stabilityTimeMs ? `${Math.round(stabilityTimeMs / 1000)}s` : 'N/A'
      },
      blockers: readinessBlockers
    });

    console.groupEnd();
    
    // Additional dynamic flags based on state combinations
    const showReady = canInteract && !isProtected;
    const showProtected = isProtected;
    const showLoading = !canInteract;
    
    return {
      // Core state flags
      canInteract,
      isProtected,
      isProtectedButReady,
      shouldRender,
      
      // UI state indicators
      showReady,
      showProtected,
      showLoading,
      
      // Detailed state information
      readinessBlockers,
      protectionTimeMs,
      stabilityTimeMs,
      
      // Debug information
      stableTimestamp,
      protectionStartTime,
    };
  }, [
    sessionStable, 
    isContextReady, 
    protectionActive, 
    readinessBlockers,
    protectionStartTime,
    stableTimestamp,
    stabilityTimeMs
  ]);

  return {
    ...guardState,
    isRedirectAllowed
  };
}
