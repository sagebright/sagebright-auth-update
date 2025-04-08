import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user, orgId } = useRequireAuth(navigate);
  
  useEffect(() => {
    if (isAuthenticated && !loading && orgId) {
      const currentOrg = getOrgFromUrl();
      
      if ((!currentOrg || currentOrg !== orgId) && orgId) {
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgId);
        return;
      }
    }
    
    if (isAuthenticated && !loading) {
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
    }
  }, [isAuthenticated, loading, location.pathname, location.search, orgId]);
  
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
