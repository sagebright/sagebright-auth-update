
import { useRef, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';

export function useRedirectLogic(
  navigate: NavigateFunction,
  locationRef: React.MutableRefObject<string>,
  userDashboardRedirectBlocker: React.MutableRefObject<boolean>,
  redirectInProgressRef: React.MutableRefObject<boolean>,
  setRedirecting: (redirecting: boolean) => void
) {
  const lastRedirectPath = useRef<string | null>(null);
  const redirectDebounceTimer = useRef<number | null>(null);

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

    // Only set redirect path if not already stored and not on login page
    if (!localStorage.getItem("redirectAfterLogin") && 
        locationRef.current !== '/auth/login' &&
        locationRef.current !== '/') {
      console.log(`📝 Storing original path for post-login: ${locationRef.current}`);
      localStorage.setItem("redirectAfterLogin", locationRef.current);
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

    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] Initiating redirect to: ${path} from ${locationRef.current}`);
    
    lastRedirectPath.current = path;
    setRedirecting(true);
    redirectInProgressRef.current = true;
    
    if (redirectDebounceTimer.current) {
      window.clearTimeout(redirectDebounceTimer.current);
    }
    
    redirectDebounceTimer.current = window.setTimeout(() => {
      console.log(`✅ [${new Date().toISOString()}] Executing redirect to: ${path}`);
      navigate(path, options);
      redirectDebounceTimer.current = null;
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
