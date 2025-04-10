
import React, { useEffect } from 'react';
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
  
  useEffect(() => {
    console.log("🛡️ ProtectedRoute running on:", location.pathname);
    console.log("🛡️ Auth status:", { loading, isAuthenticated, user, orgSlug });
    
    if (loading) return;
    
    // If not authenticated or missing user, useRequireAuth will handle the redirect
    if (!isAuthenticated || !user) return;
    
    // Handle subdomain mismatch if we have org context
    if (orgSlug) {
      const currentOrgSlug = getOrgFromUrl();
      if (orgSlug && (!currentOrgSlug || currentOrgSlug !== orgSlug)) {
        console.log("🏢 ProtectedRoute redirecting to correct org subdomain:", orgSlug);
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }

    // Handle root path redirection based on role
    if (location.pathname === '/') {
      // Get role from user_metadata
      const userRole = user?.user_metadata?.role || 'user';
      console.log("👤 ProtectedRoute user role:", userRole);
      
      const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      console.log("🏠 Redirecting from root to role-based dashboard:", targetPath);
      navigate(targetPath, { replace: true });
      return;
    }
    
    // Check for required role or permission
    if (requiredRole) {
      const userRole = user?.user_metadata?.role || 'user';
      console.log("🔒 Checking required role:", requiredRole, "User has:", userRole);
      
      if (userRole !== requiredRole) {
        console.log("🚫 User lacks required role:", requiredRole);
        navigate('/unauthorized', { replace: true });
        return;
      }
    }
    
    if (requiredPermission && 
        (!user?.user_metadata?.permissions || 
         !user.user_metadata.permissions.includes(requiredPermission))) {
      console.log("🚫 User lacks required permission:", requiredPermission);
      navigate('/unauthorized', { replace: true });
      return;
    }
    
    console.log("✅ ProtectedRoute access granted for path:", location.pathname);
  }, [
    isAuthenticated, loading, location.pathname, location.search, 
    orgId, orgSlug, navigate, requiredRole, requiredPermission, user
  ]);
  
  // Show loading spinner when auth is loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  // Only render children if we're authenticated with complete context
  return isAuthenticated && user ? <>{children}</> : null;
}

export default ProtectedRoute;
