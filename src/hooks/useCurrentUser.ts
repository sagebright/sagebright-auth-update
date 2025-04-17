
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { hasRole, isOrgAdmin, isSuperAdmin, canEdit } from '@/lib/permissions';

/**
 * Hook to access current user data with role and permission helpers
 * Combines auth context with extended user data from the backend
 */
export function useCurrentUser() {
  const { user, userId, orgId, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If auth is still loading or no userId, don't fetch user data yet
    if (authLoading || !userId) {
      return;
    }

    // We'll use the user data from the auth context instead of making a separate API call
    // This aligns with the architecture where context hydration is done by the backend
    const getUserDataFromAuth = async () => {
      try {
        // Just use the user data directly from the auth context
        setUserData(user || null);
      } catch (error) {
        console.error('Error with user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserDataFromAuth();
  }, [userId, authLoading, user]);

  // Combined user data from auth
  const currentUser = userData ? { ...user, ...userData } : user;
  const isAuthenticated = !!currentUser && !authLoading && !loading;
  
  return {
    user: currentUser,
    orgId,
    loading: authLoading || loading,
    isAuthenticated,
    
    // Permission helpers
    hasRole: (role: string) => hasRole(currentUser, role),
    isOrgAdmin: () => isOrgAdmin(currentUser),
    isSuperAdmin: () => isSuperAdmin(currentUser),
    canEdit: () => canEdit(currentUser),
  };
}

export default useCurrentUser;
