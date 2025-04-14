
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useRouteProtection } from './useRouteProtection';
import { useRedirectLogic } from './useRedirectLogic';
import { useAuthCheck } from './useAuthCheck';

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

  useAuthCheck(
    auth,
    location,
    initialCheckDone,
    sessionStabilizedRef,
    redirectInProgressRef,
    safeRedirect
  );

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
