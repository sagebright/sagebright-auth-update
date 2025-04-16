
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useOrgContext } from '@/contexts/auth/hooks/useOrgContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

export const useOrgRedirect = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isAuthenticated, loading, userId } = useAuth();
  // Call useOrgContext with the expected arguments from our implementation
  const { orgSlug } = useOrgContext(userId, isAuthenticated);
  const redirectAttempted = useRef(false);
  const lastPathRef = useRef(pathname);
  
  // Reset the redirect attempt flag when pathname changes
  useEffect(() => {
    if (pathname !== lastPathRef.current) {
      console.log(`🧭 Path changed from ${lastPathRef.current} to ${pathname}, resetting redirect flag`);
      redirectAttempted.current = false;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const currentOrgSlug = getOrgFromUrl();
    const storedRedirect = localStorage.getItem("redirectAfterLogin");
    
    console.log(`🔍 useOrgRedirect evaluation: [path: ${pathname}${search}] [auth: ${isAuthenticated}] [loading: ${loading}] [redirectAttempted: ${redirectAttempted.current}] [storedRedirect: ${storedRedirect}]`);

    // If we're already on a valid route that matches the stored redirect, don't redirect again
    if (storedRedirect && pathname === storedRedirect) {
      console.log(`✅ Already on the stored redirect path: ${pathname}, clearing redirectAfterLogin`);
      localStorage.removeItem("redirectAfterLogin");
      redirectAttempted.current = true;
      return;
    }

    // Handle org mismatch - highest priority redirect
    if (orgSlug && !redirectAttempted.current && isAuthenticated) {
      if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
        console.log("🏢 Redirecting to correct org subdomain:", orgSlug);
        console.trace("Org subdomain redirect stack trace");
        redirectAttempted.current = true;
        sessionStorage.setItem('lastAuthenticatedPath', pathname);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }

    // Handle unauthenticated user on subdomain
    if (currentOrgSlug && !loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("🔑 On subdomain but not authenticated, redirecting to login");
      console.trace("Unauthenticated subdomain redirect stack trace");
      redirectAttempted.current = true;

      if (pathname !== '/auth/login' && pathname !== '/') {
        console.log(`📝 Storing current path for post-login: ${pathname}${search}`);
        localStorage.setItem("redirectAfterLogin", pathname + search);
      }

      navigate('/auth/login', { replace: true });
      return;
    }

    // Handle authenticated user redirection
    if (isAuthenticated && !loading && !redirectAttempted.current) {
      console.log(`🔐 Auth complete, handling post-login navigation [currentPath: ${pathname}]`);
      
      // Only attempt redirect once
      redirectAttempted.current = true;

      // Only redirect from root or login page
      if (pathname === '/' || pathname === '/auth/login') {
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        console.log(`🔄 Stored redirect path: ${redirectPath || 'none'}`);
        
        if (
          redirectPath &&
          redirectPath !== '/auth/login' &&
          redirectPath !== '/'
        ) {
          console.log(`🚀 Redirecting to stored path: ${redirectPath}`);
          console.trace("Stored path redirect stack trace");
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          console.log("🚀 No stored path, redirecting to default dashboard");
          console.trace("Default dashboard redirect stack trace");
          navigate('/user-dashboard', { replace: true });
        }
      } else {
        console.log(`👤 Authenticated user already on valid route: ${pathname}, no redirect needed`);
      }
    }
  }, [orgSlug, isAuthenticated, loading, pathname, search, navigate]);

  return {
    redirectAttempted: redirectAttempted.current
  };
};
