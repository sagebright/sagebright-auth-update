
import { useRef, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ROLE_LANDING_PAGES } from './useRouteProtection';

export function useRedirectLogic(
  navigate: NavigateFunction,
  locationRef: React.MutableRefObject<string>,
  userDashboardRedirectBlocker: React.MutableRefObject<boolean>,
  redirectInProgressRef: React.MutableRefObject<boolean>,
  setRedirecting: (redirecting: boolean) => void
) {
  const lastRedirectPath = useRef<string | null>(null);
  const redirectDebounceTimer = useRef<number | null>(null);

  // Debounced redirect function to prevent multiple redirects
  const safeRedirect = useCallback((path: string, options: { replace?: boolean } = {}) => {
    // Don't redirect while another redirect is in progress
    if (redirectInProgressRef.current) {
      console.log(`🚫 Prevented redirect to ${path} - another redirect already in progress`);
      return;
    }
    
    // Check if we're trying to redirect from /ask-sage to /user-dashboard and block if needed
    if (locationRef.current === '/ask-sage' && 
        path === '/user-dashboard' && 
        userDashboardRedirectBlocker.current) {
      console.log(`🛑 Blocked redirect from /ask-sage to /user-dashboard due to protection flag`);
      return;
    }
    
    // Don't redirect to the same path multiple times
    if (path === lastRedirectPath.current) {
      console.log(`🚫 Prevented duplicate redirect to: ${path}`);
      return;
    }
    
    // Don't redirect to the current path
    if (path === locationRef.current) {
      console.log(`🚫 Prevented redirect to current path: ${path}`);
      return;
    }

    // Add timestamp to log for tracking race conditions
    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] Initiating redirect to: ${path} from ${locationRef.current}`);
    
    // Store the path we're redirecting to
    lastRedirectPath.current = path;
    setRedirecting(true);
    redirectInProgressRef.current = true;
    
    // Clear any existing redirect timer
    if (redirectDebounceTimer.current) {
      window.clearTimeout(redirectDebounceTimer.current);
    }
    
    // Debounce the redirect to prevent race conditions
    redirectDebounceTimer.current = window.setTimeout(() => {
      console.log(`✅ [${new Date().toISOString()}] Executing redirect to: ${path}`);
      navigate(path, options);
      redirectDebounceTimer.current = null;
      // Reset the redirect in progress flag after a short delay
      // This prevents immediate subsequent redirects but allows new ones after a grace period
      setTimeout(() => {
        redirectInProgressRef.current = false;
      }, 1000);
    }, 100);
  }, [navigate, locationRef, userDashboardRedirectBlocker, redirectInProgressRef, setRedirecting]);

  return {
    safeRedirect,
    getLastRedirectPath: () => lastRedirectPath.current,
    clearRedirectTimer: () => {
      if (redirectDebounceTimer.current) {
        window.clearTimeout(redirectDebounceTimer.current);
        redirectDebounceTimer.current = null;
      }
    }
  };
}
