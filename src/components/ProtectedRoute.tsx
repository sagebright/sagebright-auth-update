
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
    if (isAuthenticated && !loading && orgSlug) {
      const currentOrgSlug = getOrgFromUrl();
      
      if ((!currentOrgSlug || currentOrgSlug !== orgSlug) && orgSlug) {
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgSlug);
        return;
      }

      // Handle root path redirection based on role
      if (location.pathname === '/') {
        if (user?.role === 'admin') {
          navigate('/hr-dashboard', { replace: true });
          return;
        } else {
          navigate('/user-dashboard', { replace: true });
          return;
        }
      }
    }
    
    if (isAuthenticated && !loading) {
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
      
      // Check for required role or permission
      if (requiredRole && user?.role !== requiredRole) {
        navigate('/unauthorized', { replace: true });
        return;
      }
      
      if (requiredPermission && 
          (!user?.permissions || !user.permissions.includes(requiredPermission))) {
        navigate('/unauthorized', { replace: true });
        return;
      }
    }
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
