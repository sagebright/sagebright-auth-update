
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';
import { ROLE_LANDING_PAGES } from './useRouteProtection';

export function useAuthCheck(
  auth: any,
  location: any,
  initialCheckDone: React.MutableRefObject<boolean>,
  sessionStabilizedRef: React.MutableRefObject<boolean>,
  redirectInProgressRef: React.MutableRefObject<boolean>,
  safeRedirect: (path: string, options?: { replace?: boolean }) => void
) {
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Skip if we're already redirecting or have completed the initial check
    if (redirectInProgressRef.current) {
      return;
    }
    
    // Skip auth check on public routes or if we're already on an auth route
    if (location.pathname.startsWith("/auth")) {
      initialCheckDone.current = true;
      return;
    }

    // If still loading, don't do anything yet
    if (auth.loading) {
      return;
    }

    // Mark that we've completed the initial check
    initialCheckDone.current = true;

    // Log once for debugging
    if (!redirectAttempted.current) {
      console.log("🔐 Auth state in useRequireAuth:", { 
        loading: auth.loading, 
        isAuthenticated: auth.isAuthenticated, 
        user: !!auth.user, 
        role: auth.user?.user_metadata?.role || 'unknown',
        orgSlug: auth.orgSlug,
        pathname: location.pathname
      });
    }

    // Handle unauthenticated users - Check both isAuthenticated and session/user for safety
    if (!auth.isAuthenticated || !auth.user) {
      // Only redirect if not already on an auth page and not currently redirecting
      if (!redirectAttempted.current && !location.pathname.startsWith('/auth')) {
        console.log("❌ User not authenticated, redirecting to login");
        
        // Store the full URL with search params for redirect after login
        const fullPath = location.pathname + location.search;
        console.log("📝 Storing redirect path:", fullPath);
        localStorage.setItem("redirectAfterLogin", fullPath);
        
        redirectAttempted.current = true;
        safeRedirect('/auth/login', { replace: true });
      }
      return;
    }

    // !!!! CRITICAL GATE !!!!
    // Do not proceed with routing decisions until session is fully stabilized
    // This prevents race conditions where redirects happen with incomplete data
    if (!sessionStabilizedRef.current) {
      console.log("⏳ Waiting for session to stabilize before routing decisions");
      return;
    }

    // Get user's role from user_metadata (most reliable source)
    const userRole = auth.user?.user_metadata?.role || 'user';
    console.log("👤 Routing with user role:", userRole);

    // Handle org context if available
    if (auth.orgSlug) {
      // Handle subdomain mismatch - ensure user is on the correct subdomain
      const currentOrgSlug = getOrgFromUrl();
      if (auth.orgSlug && (!currentOrgSlug || currentOrgSlug !== auth.orgSlug) && !redirectAttempted.current) {
        console.log("🏢 Redirecting to correct org subdomain:", auth.orgSlug);
        
        // Store path for after subdomain redirect - use role-based landing
        const targetPath = ROLE_LANDING_PAGES[userRole as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
        console.log("🎯 Target path based on role:", targetPath);
        sessionStorage.setItem('lastAuthenticatedPath', targetPath);
        
        redirectAttempted.current = true;
        redirectToOrgUrl(auth.orgSlug);
        return;
      }
    }

    // Handle root path redirection based on role
    // Critical fix: Only redirect if current path is exactly '/' to prevent redirecting from /ask-sage
    if (location.pathname === '/' && !redirectAttempted.current && !redirectInProgressRef.current) {
      // Get the appropriate landing page for this user's role
      const targetPath = ROLE_LANDING_PAGES[userRole as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
      
      console.log(`🏠 Redirecting from root to role-based path: ${targetPath}`);
      console.log(`📍 Current path: ${location.pathname}`);
      
      redirectAttempted.current = true;
      safeRedirect(targetPath, { replace: true });
      return;
    }
  }, [
    auth.loading, 
    auth.isAuthenticated, 
    auth.user, 
    auth.orgSlug, 
    location.pathname, 
    location.search,
    safeRedirect, 
    initialCheckDone,
    sessionStabilizedRef,
    redirectInProgressRef
  ]);

  return {
    isRedirectAttempted: () => redirectAttempted.current
  };
}
