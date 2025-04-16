
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useOrgContext } from '@/contexts/auth/hooks/useOrgContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

export const useOrgRedirect = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isAuthenticated, loading, userId } = useAuth();
  const { orgSlug } = useOrgContext(userId, isAuthenticated);
  const redirectAttempted = useRef(false);
  const redirectLocked = useRef(false);
  const lastPathRef = useRef(pathname);
  
  useEffect(() => {
    if (pathname !== lastPathRef.current && !redirectLocked.current) {
      console.log(`🧭 Path changed from ${lastPathRef.current} to ${pathname}, resetting redirect flag`);
      redirectAttempted.current = false;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const currentOrgSlug = getOrgFromUrl();
    const storedRedirect = localStorage.getItem("redirectAfterLogin");
    
    console.log(`🔍 useOrgRedirect evaluation: [path: ${pathname}${search}] [auth: ${isAuthenticated}] [loading: ${loading}] [redirectAttempted: ${redirectAttempted.current}] [storedRedirect: ${storedRedirect}]`);

    if (pathname === '/ask-sage' && !redirectAttempted.current) {
      console.log("🛑 Blocking all fallback redirects — already on /ask-sage");
      redirectAttempted.current = true;
      redirectLocked.current = true;
      return;
    }

    if (storedRedirect && pathname === storedRedirect) {
      console.log(`✅ Already on the stored redirect path: ${pathname}, clearing redirectAfterLogin`);
      localStorage.removeItem("redirectAfterLogin");
      redirectAttempted.current = true;
      redirectLocked.current = true;
      return;
    }

    if (orgSlug && !redirectAttempted.current && isAuthenticated) {
      if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
        console.log("🏢 Redirecting to correct org subdomain:", orgSlug);
        console.trace("Org subdomain redirect stack trace");
        redirectAttempted.current = true;
        redirectLocked.current = true;
        sessionStorage.setItem('lastAuthenticatedPath', pathname);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }

    if (currentOrgSlug && !loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("🔑 On subdomain but not authenticated, redirecting to login");
      console.trace("Unauthenticated subdomain redirect stack trace");
      redirectAttempted.current = true;
      redirectLocked.current = true;

      if (pathname !== '/auth/login' && pathname !== '/') {
        console.log(`📝 Storing current path for post-login: ${pathname}${search}`);
        localStorage.setItem("redirectAfterLogin", pathname + search);
      }

      navigate('/auth/login', { replace: true });
      return;
    }

    if (isAuthenticated && !loading && !redirectAttempted.current) {
      console.log(`🔐 Auth complete, handling post-login navigation [currentPath: ${pathname}]`);
      
      redirectAttempted.current = true;

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      const isSafePath = redirectPath && !['/', '/auth/login', '/user-dashboard'].includes(redirectPath);

      if (isSafePath) {
        console.log(`🚀 Redirecting to stored path: ${redirectPath}`);
        localStorage.removeItem("redirectAfterLogin");
        redirectAttempted.current = true;
        redirectLocked.current = true;
        navigate(redirectPath, { replace: true });
      } else {
        if (pathname !== '/ask-sage') {
          console.log("🚀 No stored path, redirecting to default dashboard");
          navigate('/user-dashboard', { replace: true });
        } else {
          console.log("🔕 Skipping dashboard redirect — already on /ask-sage");
        }
        redirectAttempted.current = true;
        redirectLocked.current = true;
      }
    }
  }, [orgSlug, isAuthenticated, loading, pathname, search, navigate]);

  return {
    redirectAttempted: redirectAttempted.current
  };
};
