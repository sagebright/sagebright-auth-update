
import { useEffect, useState, useRef } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';
import { toast } from '@/components/ui/use-toast';

// Map user roles to their default landing pages
const ROLE_LANDING_PAGES = {
  admin: '/hr-dashboard',
  user: '/ask-sage',  // Important: default for regular users is /ask-sage
  default: '/ask-sage' // Fallback if role is unknown
};

export function useRequireAuth(navigate: NavigateFunction) {
  const location = useLocation();
  const auth = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const initialCheckDone = useRef(false);
  const redirectAttempted = useRef(false);
  const lastRedirectPath = useRef<string | null>(null);
  const redirectDebounceTimer = useRef<number | null>(null);
  const userDashboardRedirectBlocker = useRef<boolean>(false);
  const locationRef = useRef(location.pathname);
  const sessionStabilizedRef = useRef(false);
  const redirectInProgressRef = useRef(false);

  // Update locationRef whenever location changes
  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  // Session stabilization - wait for both auth and metadata to be reliable
  // This is a critical gate to prevent premature redirects
  useEffect(() => {
    // Check if we have complete session data
    if (!auth.loading && 
        auth.isAuthenticated && 
        auth.user?.user_metadata && 
        !sessionStabilizedRef.current) {
      
      console.log("✅ Session data fully stabilized:", {
        userId: auth.userId,
        role: auth.user?.user_metadata?.role || 'unknown',
        orgId: auth.orgId
      });
      
      sessionStabilizedRef.current = true;
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, auth.userId, auth.orgId]);

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
    }
  }, [location.pathname]);

  useEffect(() => {
    // Clean up any pending redirect timer on unmount
    return () => {
      if (redirectDebounceTimer.current) {
        window.clearTimeout(redirectDebounceTimer.current);
      }
    };
  }, []);

  // Debounced redirect function to prevent multiple redirects
  const safeRedirect = (path: string, options: { replace?: boolean } = {}) => {
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
  };

  useEffect(() => {
    // Skip if we're already redirecting or have completed the initial check
    if (redirecting || redirectInProgressRef.current) {
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
    navigate, 
    safeRedirect
  ]);

  // Return all the auth state plus the orgSlug explicitly
  return {
    user: auth.user,
    userId: auth.userId,
    orgId: auth.orgId,
    orgSlug: auth.orgSlug,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
  };
}
