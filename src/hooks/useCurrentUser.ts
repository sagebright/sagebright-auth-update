
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { hasRole, isOrgAdmin, isSuperAdmin, canEdit } from '@/lib/permissions';

/**
 * Hook to access current user data with role and permission helpers
 * Combines auth context with extended user data from the backend
 */
export function useCurrentUser() {
  const { user, userId, orgId, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If auth is still loading or no userId, don't set loading to false yet
    if (authLoading || !userId) {
      return;
    }
    
    // Once auth is loaded and we have the user data, update loading state
    setLoading(false);
  }, [userId, authLoading, user]);

  // Use the user data directly from auth context
  const isAuthenticated = !!user && !authLoading && !loading;
  
  return {
    user,
    orgId,
    loading: authLoading || loading,
    isAuthenticated,
    
    // Permission helpers
    hasRole: (role: string) => hasRole(user, role),
    isOrgAdmin: () => isOrgAdmin(user),
    isSuperAdmin: () => isSuperAdmin(user),
    canEdit: () => canEdit(user),
  };
}

export default useCurrentUser;
