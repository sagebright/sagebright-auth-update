
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getUsers } from '@/lib/backendApi';
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

    // Fetch extended user data from backend
    const fetchUserData = async () => {
      try {
        const users = await getUsers();
        const currentUser = users?.find(u => u.id === userId) || null;
        setUserData(currentUser);
      } catch (error) {
        console.error('Error fetching current user data:', error);
        // Fall back to basic user data from auth context
        // Don't show an error to the user - we'll just use the basic auth data
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, authLoading]);

  // Combined user data from auth and backend
  // Even if userData fetch fails, we still have the basic user info from auth
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
