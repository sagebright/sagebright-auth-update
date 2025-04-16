import { useEffect, useState, useRef } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from '@/components/ui/use-toast';

// Map user roles to their default landing pages
export const ROLE_LANDING_PAGES = {
  admin: '/hr-dashboard',
  user: '/user-dashboard',
  default: '/user-dashboard'
};

export function useRouteProtection(navigate: NavigateFunction) {
  const location = useLocation();
  const auth = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const initialCheckDone = useRef(false);
  const userDashboardRedirectBlocker = useRef<boolean>(false);
  const locationRef = useRef(location.pathname);
  const sessionStabilizedRef = useRef(false);
  const redirectInProgressRef = useRef(false);

  // Update locationRef whenever location changes
  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  // Session stabilization - wait for both auth and metadata to be reliable
  useEffect(() => {
    // Check if we have complete session data
    if (!auth.loading && 
        auth.isAuthenticated && 
        auth.user?.user_metadata && 
        !sessionStabilizedRef.current) {
      
      console.log("✅ Session data fully stabilized:", {
        userId: auth.userId,
        role: auth.user?.user_metadata?.role || 'unknown',
        orgId: auth.orgId,
        currentPath: location.pathname
      });
      
      sessionStabilizedRef.current = true;
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, auth.userId, auth.orgId, location.pathname]);

  // Special route protection for /ask-sage to prevent unwanted redirects
  useEffect(() => {
    if (location.pathname === '/ask-sage') {
      console.log("🛡️ Setting ask-sage protection flag");
      userDashboardRedirectBlocker.current = true;
      
      // Clear this protection after 10 seconds to avoid permanent blocking
      const timerId = setTimeout(() => {
        userDashboardRedirectBlocker.current = false;
        console.log("🛡️ Cleared ask-sage protection flag after timeout");
      }, 10000);
      
      return () => clearTimeout(timerId);
    } else {
      // If we navigate away from /ask-sage, clear the blocker
      if (userDashboardRedirectBlocker.current) {
        console.log("🛡️ Clearing ask-sage protection flag due to route change");
        userDashboardRedirectBlocker.current = false;
      }
    }
  }, [location.pathname]);

  return {
    auth,
    location,
    redirecting,
    setRedirecting,
    initialCheckDone,
    userDashboardRedirectBlocker,
    locationRef,
    sessionStabilizedRef,
    redirectInProgressRef,
    ROLE_LANDING_PAGES
  };
}
