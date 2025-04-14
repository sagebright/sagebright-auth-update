
import { useEffect, useState, useRef } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

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

  // Update locationRef whenever location changes
  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    console.log("🔐 useRequireAuth locationRef current value:", locationRef.current);
  }, []);

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
    
    // Clear any existing redirect timer
    if (redirectDebounceTimer.current) {
      window.clearTimeout(redirectDebounceTimer.current);
    }
    
    // Debounce the redirect to prevent race conditions
    redirectDebounceTimer.current = window.setTimeout(() => {
      console.log(`✅ [${new Date().toISOString()}] Executing redirect to: ${path}`);
      navigate(path, options);
      redirectDebounceTimer.current = null;
    }, 100);
  };

  useEffect(() => {
    // Skip if we're already redirecting or have completed the initial check
    if (redirecting || (initialCheckDone.current && auth.isAuthenticated)) {
      return;
    }
    
    console.log("🔐 useRequireAuth running on:", location.pathname);
    console.log("🔐 Auth state:", { 
      loading: auth.loading, 
      isAuthenticated: auth.isAuthenticated, 
      user: !!auth.user, 
      orgSlug: auth.orgSlug,
      role: auth.user?.user_metadata?.role || 'unknown',
      pathname: location.pathname
    });

    // Skip auth check on public routes or if we're already on an auth route
    if (location.pathname.startsWith("/auth")) {
      initialCheckDone.current = true;
      return;
    }

    // If still loading, don't do anything yet
    if (auth.loading) {
      console.log("⏳ Auth still loading, waiting...");
      return;
    }

    // Mark that we've completed the initial check
    initialCheckDone.current = true;

    // Handle unauthenticated users - Check both isAuthenticated and session/user for safety
    if (!auth.isAuthenticated || !auth.user) {
      console.log("❌ User not authenticated, redirecting to login");
      
      // Store the full URL with search params for redirect after login
      const fullPath = location.pathname + location.search;
      console.log("📝 Storing redirect path:", fullPath);
      localStorage.setItem("redirectAfterLogin", fullPath);
      
      setRedirecting(true);
      safeRedirect('/auth/login', { replace: true });
      return;
    }

    // Make sure we have the user's role from user_metadata
    const userRole = auth.user?.user_metadata?.role || 'user';
    console.log("👤 User role from metadata:", userRole);

    // We now have a fully authenticated user
    console.log("✅ User authenticated with role:", userRole);

    // Handle org context if available
    if (auth.orgSlug) {
      console.log("🏢 User has org context:", auth.orgSlug);
      
      // Handle subdomain mismatch - ensure user is on the correct subdomain
      const currentOrgSlug = getOrgFromUrl();
      if (auth.orgSlug && (!currentOrgSlug || currentOrgSlug !== auth.orgSlug) && !redirectAttempted.current) {
        console.log("🏢 Redirecting to correct org subdomain:", auth.orgSlug);
        
        // Store path for after subdomain redirect
        const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage';
        console.log("🎯 Target path based on role:", targetPath);
        sessionStorage.setItem('lastAuthenticatedPath', targetPath);
        
        setRedirecting(true);
        redirectAttempted.current = true;
        redirectToOrgUrl(auth.orgSlug);
        return;
      }
    }

    // Handle root path redirection based on role
    // Critical fix: Only redirect if current path is exactly '/' to prevent redirecting from /ask-sage
    if (location.pathname === '/' && !redirectAttempted.current) {
      // Check if we're at exactly the root path, not any other path
      const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage'; // Changed default for user to /ask-sage
      
      console.log(`🏠 Redirecting from root to role-based path: ${targetPath}`);
      console.log(`📍 Current path: ${location.pathname}`);
      
      redirectAttempted.current = true;
      safeRedirect(targetPath, { replace: true });
      return;
    }
    
  }, [auth.loading, auth.isAuthenticated, auth.user, auth.orgSlug, location.pathname, navigate, safeRedirect]);

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
