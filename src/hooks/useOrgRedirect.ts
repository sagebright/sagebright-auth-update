import { useEffect, useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

interface OrgRedirectProps {
  orgSlug: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  pathname: string;
  navigate: NavigateFunction;
}

export const useOrgRedirect = ({
  orgSlug,
  isAuthenticated,
  loading,
  pathname,
  navigate
}: OrgRedirectProps) => {
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const currentOrgSlug = getOrgFromUrl();
    
    // Handle org subdomain redirects - ensure user is on the correct org subdomain
    if (orgSlug && !redirectAttempted.current && isAuthenticated) {
      if (orgSlug && (!currentOrgSlug || currentOrgSlug !== orgSlug)) {
        console.log("🏢 Redirecting to correct org subdomain:", orgSlug);
        redirectAttempted.current = true;
        sessionStorage.setItem('lastAuthenticatedPath', pathname);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }
    
    // Only redirect to login if on a subdomain, not authenticated, and not already redirecting
    if (currentOrgSlug && !loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("🔑 On subdomain but not authenticated, redirecting to login");
      redirectAttempted.current = true;
      
      // Store current path before redirecting to login
      if (pathname !== '/auth/login' && pathname !== '/') {
        localStorage.setItem("redirectAfterLogin", pathname);
      }
      
      navigate('/auth/login', { replace: true });
    }
    
    // Only redirect to dashboard if user is on root or login page, not already on a specific route
    if (isAuthenticated && !loading && !redirectAttempted.current) {
      // Only redirect if the user is on / or /auth/login - don't bounce them from other valid routes
      if (pathname === '/' || pathname === '/auth/login') {
        console.log("👤 Authenticated user on root/login, redirecting to dashboard");
        redirectAttempted.current = true;
        
        // Get the stored redirect path if available
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath && redirectPath !== '/auth/login' && redirectPath !== '/') {
          console.log("🔄 Redirecting to stored path:", redirectPath);
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          // Otherwise default to user dashboard
          console.log("🔄 No stored path, redirecting to default dashboard");
          navigate('/user-dashboard', { replace: true });
        }
      } else {
        console.log("👤 Authenticated user already on valid route:", pathname);
      }
    }
  }, [orgSlug, isAuthenticated, loading, pathname, navigate]);
};
