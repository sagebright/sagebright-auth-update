
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
  }, [orgSlug, isAuthenticated, loading, pathname, navigate]);
};
