import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated } = useRequireAuth(navigate);
  
  // Keep track of last authenticated location to prevent unwanted redirects
  useEffect(() => {
    if (isAuthenticated && !loading) {
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
    }
  }, [isAuthenticated, loading, location.pathname, location.search]);
  
  if (loading) {
    // Show loading spinner while authentication state is being determined
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-sagebright-green border-t-transparent rounded-full"></div>
        <span className="ml-2 text-sagebright-green">Loading...</span>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
