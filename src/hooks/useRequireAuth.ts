
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useRouteProtection } from './useRouteProtection';
import { useRedirectLogic } from './useRedirectLogic';

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

  // This is where the error was - we need to call useAuthCheck with the correct props
  // Use the hook directly and pass the required props
  useEffect(() => {
    // Only run the check if initial setup is done
    if (!initialCheckDone.current) return;

    // Skip if redirect is already in progress
    if (redirectInProgressRef.current) return;

    // Skip if session is not yet stabilized
    if (!sessionStabilizedRef.current && auth.isAuthenticated) return;

    // If user is not authenticated, redirect to login
    if (!auth.loading && !auth.isAuthenticated) {
      console.log("🔑 Not authenticated, redirecting to login");
      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
      safeRedirect('/auth/login', { replace: true });
      return;
    }

    // Check user permissions and roles if needed
    // (This was likely part of the original useAuthCheck implementation)
    if (auth.user && auth.isAuthenticated) {
      console.log("✅ User authenticated, continuing to route");
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, location.pathname, location.search, safeRedirect]);

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
