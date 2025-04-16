
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useOrgContext } from '@/contexts/auth/hooks/useOrgContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

export const useOrgRedirect = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { orgSlug } = useOrgContext();
  const { isAuthenticated, loading } = useAuth();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const currentOrgSlug = getOrgFromUrl();

    if (orgSlug && !redirectAttempted.current && isAuthenticated) {
      if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
        console.log("🏢 Redirecting to correct org subdomain:", orgSlug);
        redirectAttempted.current = true;
        sessionStorage.setItem('lastAuthenticatedPath', pathname);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }

    if (currentOrgSlug && !loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("🔑 On subdomain but not authenticated, redirecting to login");
      redirectAttempted.current = true;

      if (pathname !== '/auth/login' && pathname !== '/') {
        localStorage.setItem("redirectAfterLogin", pathname);
      }

      navigate('/auth/login', { replace: true });
      return;
    }

    if (isAuthenticated && !loading && !redirectAttempted.current) {
      redirectAttempted.current = true;

      if (pathname === '/' || pathname === '/auth/login') {
        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (
          redirectPath &&
          redirectPath !== '/auth/login' &&
          redirectPath !== '/'
        ) {
          console.log("🔄 Redirecting to stored path:", redirectPath);
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          console.log("🔄 No stored path, redirecting to default dashboard");
          navigate('/user-dashboard', { replace: true });
        }
      } else {
        console.log("👤 Authenticated user already on valid route:", pathname);
      }
    }
  }, [orgSlug, isAuthenticated, loading, pathname, navigate]);
};
