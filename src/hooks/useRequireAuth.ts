
import { useEffect, useState, useRef } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

export function useRequireAuth(navigate: NavigateFunction) {
  const location = useLocation();
  const auth = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const initialCheckDone = useRef(false);

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
      role: auth.user?.user_metadata?.role || 'unknown'
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
      navigate('/auth/login', { replace: true });
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
      if (auth.orgSlug && (!currentOrgSlug || currentOrgSlug !== auth.orgSlug)) {
        console.log("🏢 Redirecting to correct org subdomain:", auth.orgSlug);
        
        // Store path for after subdomain redirect
        const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
        console.log("🎯 Target path based on role:", targetPath);
        sessionStorage.setItem('lastAuthenticatedPath', targetPath);
        
        setRedirecting(true);
        redirectToOrgUrl(auth.orgSlug);
        return;
      }
    }

    // Handle root path redirection based on role
    if (location.pathname === '/') {
      const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      
      console.log("🏠 Redirecting from root to role-based dashboard:", targetPath);
      setRedirecting(true);
      navigate(targetPath, { replace: true });
      return;
    }

  }, [auth.loading, auth.isAuthenticated, auth.user, auth.orgSlug, location.pathname, navigate]);

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
