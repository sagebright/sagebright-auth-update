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
  
  // Handle organization subdomain routing
  useEffect(() => {
    if (isAuthenticated && !loading && orgId) {
      const currentOrg = getOrgFromUrl();
      
      // If user belongs to an org but no org context is present in URL,
      // or if the current org context doesn't match user's org,
      // redirect to the correct org subdomain
      if ((!currentOrg || currentOrg !== orgId) && orgId) {
        // Store full path including search params for after redirect
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgId);
        return;
      }
    }
    
    // Keep track of last authenticated location to prevent unwanted redirects
    if (isAuthenticated && !loading) {
      // Store full path including search params
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
    }
  }, [isAuthenticated, loading, location.pathname, location.search, orgId]);
  
  if (loading) {
    // Show loading spinner while authentication state is being determined
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
