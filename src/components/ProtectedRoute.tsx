
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useOrgRedirect } from '@/hooks/useOrgRedirect';

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

  // Check authentication and permissions
  useAuthCheck({
    user,
    loading,
    isAuthenticated,
    requiredRole,
    requiredPermission,
    navigate,
    pathname: location.pathname + location.search
  });

  // Use the updated useOrgRedirect hook - now returns redirectAttempted state
  const { redirectAttempted } = useOrgRedirect();
  
  // Add enhanced logging for protected route rendering
  console.log(`🛡️ ProtectedRoute rendering: [path: ${location.pathname}] [authenticated: ${isAuthenticated}] [loading: ${loading}] [redirectAttempted: ${redirectAttempted}]`);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }
  
  console.log("✅ ProtectedRoute access granted for path:", location.pathname);
  
  return <>{children}</>;
};

export default ProtectedRoute;
