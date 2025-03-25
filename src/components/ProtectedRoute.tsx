
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    // You could show a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Always render children without checking for authentication
  return <>{children}</>;
};

export default ProtectedRoute;
