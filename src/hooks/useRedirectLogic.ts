
import { useRef, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

export function useRedirectLogic(
  navigate: NavigateFunction,
  locationRef: React.MutableRefObject<string>,
  userDashboardRedirectBlocker: React.MutableRefObject<boolean>,
  redirectInProgressRef: React.MutableRefObject<boolean>,
  setRedirecting: (redirecting: boolean) => void
) {
  const lastRedirectPath = useRef<string | null>(null);
  const redirectDebounceTimer = useRef<number | null>(null);
  
  // Initialize intent manager at this level to track and coordinate redirects
  const { captureIntent, activeIntent } = useRedirectIntentManager({
    enableLogging: true
  });

  const safeRedirect = useCallback((path: string, options: { replace?: boolean } = {}) => {
    // Don't redirect while another redirect is in progress
    if (redirectInProgressRef.current) {
      console.log(`🚫 Prevented redirect to ${path} - another redirect already in progress`);
      return;
    }
    
    // CRITICAL: Enhanced check for redundant /ask-sage to /user-dashboard redirects
    // This is the core of the current issue - block ANY redirect from ask-sage to user-dashboard
    if (locationRef.current === '/ask-sage' && path === '/user-dashboard') {
      console.log(`🛑 Blocked redirect from /ask-sage to /user-dashboard - preserving intended destination`);
      
      // Additionally, capture this as an intent to help debug
      captureIntent(
        '/ask-sage', 
        'user-initiated',
        {
          source: 'blocked_redirect',
          originalDestination: '/user-dashboard',
          reason: 'ask_sage_protection'
        },
        1
      );
      
      return;
    }
    
    // Special handling for Ask Sage intent preservation
    // If we're on the login page and have a stored intent to go to Ask Sage, prioritize that
    if (locationRef.current === '/auth/login' && path === '/user-dashboard') {
      // Check for an active intent first (higher priority)
      if (activeIntent && activeIntent.destination === '/ask-sage') {
        console.log(`🔀 Using intent: redirecting to /ask-sage instead of /user-dashboard`);
        path = '/ask-sage';
      } 
      // Fall back to legacy storage if no intent
      else {
        const storedRedirect = localStorage.getItem("redirectAfterLogin");
        if (storedRedirect === '/ask-sage') {
          console.log(`🔀 Redirecting to /ask-sage instead of /user-dashboard based on stored intent`);
          path = '/ask-sage';
        }
      }
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
        !activeIntent &&
        locationRef.current !== '/auth/login' &&
        locationRef.current !== '/') {
      console.log(`📝 Storing original path for post-login: ${locationRef.current}`);
      
      // Capture as an intent for better tracking (higher priority)
      captureIntent(
        locationRef.current,
        'auth',
        {
          source: 'pre_auth_capture',
          timestamp: Date.now(),
          originalSearch: window.location.search
        },
        2
      );
      
      // Legacy support
      localStorage.setItem("redirectAfterLogin", locationRef.current);
      
      // If there are search params, store them too
      const searchParams = window.location.search;
      if (searchParams) {
        console.log(`📝 Storing search params for post-login: ${searchParams}`);
        localStorage.setItem("storedSearchParams", searchParams);
      }
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
    
    // Add a delay to reduce race conditions and allow context to stabilize
    const REDIRECT_DELAY = path === '/ask-sage' ? 300 : 100;
    
    redirectDebounceTimer.current = window.setTimeout(() => {
      console.log(`✅ [${new Date().toISOString()}] Executing redirect to: ${path}`);
      
      // Check if we need to add stored search params
      if (path === '/ask-sage') {
        const storedParams = localStorage.getItem("storedSearchParams");
        if (storedParams && !path.includes('?')) {
          console.log(`🔍 Adding stored search params to redirect: ${storedParams}`);
          path += storedParams;
        }
      }
      
      navigate(path, options);
      redirectDebounceTimer.current = null;
      
      // Allow a cooling period before enabling redirects again
      setTimeout(() => {
        redirectInProgressRef.current = false;
      }, 1000);
    }, REDIRECT_DELAY);
  }, [navigate, locationRef, userDashboardRedirectBlocker, redirectInProgressRef, setRedirecting, captureIntent, activeIntent]);

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
