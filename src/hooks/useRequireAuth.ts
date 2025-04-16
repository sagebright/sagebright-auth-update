
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useRouteProtection } from './useRouteProtection';
import { useRedirectLogic } from './useRedirectLogic';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

export function useRequireAuth(navigate: NavigateFunction) {
  const {
    auth,
    location,
    redirecting,
    setRedirecting,
    initialCheckDone,
    userDashboardRedirectBlocker,
    locationRef,
    sessionStabilizedRef,
    redirectInProgressRef,
  } = useRouteProtection(navigate);

  const { safeRedirect, clearRedirectTimer } = useRedirectLogic(
    navigate,
    locationRef,
    userDashboardRedirectBlocker,
    redirectInProgressRef,
    setRedirecting
  );

  // Initialize intent manager to track redirects at the auth layer
  const { captureIntent, executeRedirect, activeIntent } = useRedirectIntentManager({
    enableLogging: true
  });

  // Enhanced auth check with better intent integration
  useEffect(() => {
    // Only run the check if initial setup is done
    if (!initialCheckDone.current) return;

    // Skip if redirect is already in progress
    if (redirectInProgressRef.current) return;

    // Skip if session is not yet stabilized
    if (!sessionStabilizedRef.current && auth.isAuthenticated) return;

    // If user is not authenticated, handle with intent system
    if (!auth.loading && !auth.isAuthenticated) {
      console.log("🔑 Not authenticated, redirecting to login");
      
      // If we don't already have an active intent, capture one
      if (!activeIntent) {
        captureIntent(
          location.pathname + location.search,
          'auth',
          {
            source: 'useRequireAuth',
            timestamp: Date.now(),
            context: 'unauthenticated_access'
          },
          2 // Higher priority for auth protection
        );
      }
      
      safeRedirect('/auth/login', { replace: true });
      return;
    }

    // Check user permissions and roles if needed
    if (auth.user && auth.isAuthenticated) {
      console.log("✅ User authenticated, continuing to route");
    }
  }, [
    auth.loading, 
    auth.isAuthenticated, 
    auth.user, 
    location.pathname, 
    location.search, 
    safeRedirect, 
    captureIntent,
    activeIntent
  ]);

  // Clean up any pending redirect timer on unmount
  useEffect(() => {
    return () => {
      clearRedirectTimer();
    };
  }, [clearRedirectTimer]);

  // Return all the auth state plus the orgSlug explicitly
  return {
    user: auth.user,
    userId: auth.userId,
    orgId: auth.orgId,
    orgSlug: auth.orgSlug,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
  };
}
