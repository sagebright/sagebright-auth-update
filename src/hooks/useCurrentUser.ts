
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { hasRole, isOrgAdmin, isSuperAdmin, canEdit } from '@/lib/permissions';
import useSageContext from '@/hooks/useSageContext';

/**
 * Hook to access current user data with role and permission helpers
 * Uses the centralized context system instead of direct API calls
 */
export function useCurrentUser() {
  const { userId, loading: authLoading } = useAuth();
  const { userContext, orgContext, loading: contextLoading } = useSageContext();
  
  // Combined loading state from both auth and context
  const loading = authLoading || contextLoading;
  
  // Use the user data from our centralized context hook
  const isAuthenticated = !!userContext && !loading;
  
  return {
    user: userContext,
    orgId: orgContext?.id,
    loading,
    isAuthenticated,
    
    // Permission helpers
    hasRole: (role: string) => hasRole(userContext, role),
    isOrgAdmin: () => isOrgAdmin(userContext),
    isSuperAdmin: () => isSuperAdmin(userContext),
    canEdit: () => canEdit(userContext),
  };
}

export default useCurrentUser;
