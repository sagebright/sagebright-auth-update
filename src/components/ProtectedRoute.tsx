
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while authentication state is being determined
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-sagebright-green border-t-transparent rounded-full"></div>
        <span className="ml-2 text-sagebright-green">Loading...</span>
      </div>
    );
  }

  // If not logged in, redirect to login page, saving the current location for redirect after login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return <>{children}</>;
};

export default ProtectedRoute;
