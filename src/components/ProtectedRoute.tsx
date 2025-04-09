
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
    
    // If not authenticated, useRequireAuth will handle the redirect to login
    if (!isAuthenticated) return;
    
    // Handle subdomain mismatch
    if (orgSlug) {
      const currentOrgSlug = getOrgFromUrl();
      
      if ((!currentOrgSlug || currentOrgSlug !== orgSlug)) {
        console.log("🏢 ProtectedRoute redirecting to correct org subdomain:", orgSlug);
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgSlug);
        return;
      }
    }

    // Handle root path redirection based on role
    if (location.pathname === '/') {
      const userRole = user?.user_metadata?.role || 'user';
      const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      console.log("🏠 Redirecting from root to role-based dashboard:", targetPath);
      navigate(targetPath, { replace: true });
      return;
    }
    
    // Check for required role or permission
    if (requiredRole && user?.user_metadata?.role !== requiredRole) {
      console.log("🚫 User lacks required role:", requiredRole);
      navigate('/unauthorized', { replace: true });
      return;
    }
    
    if (requiredPermission && 
        (!user?.permissions || !user.permissions.includes(requiredPermission))) {
      console.log("🚫 User lacks required permission:", requiredPermission);
      navigate('/unauthorized', { replace: true });
      return;
    }
    
    console.log("✅ ProtectedRoute access granted for path:", location.pathname);
  }, [
    isAuthenticated, loading, location.pathname, location.search, 
    orgId, orgSlug, navigate, requiredRole, requiredPermission, user
  ]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
