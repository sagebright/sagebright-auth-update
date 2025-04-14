
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user, orgId, orgSlug } = useRequireAuth(navigate);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const redirectAttempted = useRef(false);
  
  // Store search parameters that need to be preserved across auth flow
  useEffect(() => {
    if (location.search && location.search.includes('voice=')) {
      localStorage.setItem("preserveSearchParams", location.search);
      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
      console.log("📝 Stored voice param and redirect path:", location.pathname + location.search);
    }
  }, [location]);
  
  // Track whether we've already attempted a redirection to prevent loops
  useEffect(() => {
    if (!loading && !initialCheckComplete) {
      setInitialCheckComplete(true);
    }
  }, [loading, initialCheckComplete]);
  
  // Prevent unwanted redirects between ask-sage and user-dashboard
  const shouldPreventRouteRedirect = (path: string): boolean => {
    // Don't bounce between these routes
    if ((location.pathname === '/ask-sage' && path === '/user-dashboard') ||
        (location.pathname === '/user-dashboard' && path === '/ask-sage')) {
      console.log(`🛑 Preventing unwanted redirect: ${location.pathname} → ${path}`);
      return true;
    }
    return false;
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  // If not authenticated, useRequireAuth will handle the redirect
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Only attempt subdomain redirects if we've completed the initial check and haven't tried already
  // This prevents multiple redirects
  if (initialCheckComplete && orgSlug && !redirectAttempted.current) {
    const currentOrgSlug = getOrgFromUrl();
    if (orgSlug && (!currentOrgSlug || currentOrgSlug !== orgSlug)) {
      console.log("🏢 ProtectedRoute redirecting to correct org subdomain:", orgSlug);
      redirectAttempted.current = true; // Prevent further redirect attempts
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
      redirectToOrgUrl(orgSlug);
      return null;
    }
  }

  // Handle root path redirection based on role
  if (location.pathname === '/' && !redirectAttempted.current) {
    // Get role from user_metadata
    const userRole = user?.user_metadata?.role || 'user';
    const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage'; // Default for users is /ask-sage
    
    // Prevent unwanted redirects
    if (!shouldPreventRouteRedirect(targetPath)) {
      redirectAttempted.current = true;
      navigate(targetPath, { replace: true });
      return null;
    }
  }
  
  // Check for required role or permission
  if (requiredRole) {
    const userRole = user?.user_metadata?.role || 'user';
    
    if (userRole !== requiredRole) {
      console.log("🚫 User lacks required role:", requiredRole);
      navigate('/unauthorized', { replace: true });
      return null;
    }
  }
  
  if (requiredPermission && 
      (!user?.user_metadata?.permissions || 
       !user.user_metadata.permissions.includes(requiredPermission))) {
    console.log("🚫 User lacks required permission:", requiredPermission);
    navigate('/unauthorized', { replace: true });
    return null;
  }
  
  console.log("✅ ProtectedRoute access granted for path:", location.pathname);
  
  // Only render children if we're authenticated and have all required permissions
  return <>{children}</>;
}

export default ProtectedRoute;
