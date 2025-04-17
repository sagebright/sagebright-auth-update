
import { useAuth } from '@/contexts/auth/AuthContext';
import useSageContext from '@/hooks/useSageContext';
import { hasRole, isOrgAdmin, isSuperAdmin, canEdit } from '@/lib/permissions';

export function useCurrentUser() {
  const { user } = useAuth();
  const { userContext } = useSageContext();

  // Provide a unified user object that combines data from both auth and sage context
  const currentUser = user || userContext || null;

  // User permission helper functions
  const checkHasRole = (role: string) => {
    if (!currentUser) return false;
    return hasRole(currentUser, role);
  };

  const checkIsOrgAdmin = () => {
    if (!currentUser) return false;
    return isOrgAdmin(currentUser);
  };

  const checkIsSuperAdmin = () => {
    if (!currentUser) return false;
    return isSuperAdmin(currentUser);
  };

  const checkCanEdit = (resource: any) => {
    if (!currentUser) return false;
    return canEdit(currentUser, resource);
  };

  return {
    currentUser,
    hasRole: checkHasRole,
    isOrgAdmin: checkIsOrgAdmin,
    isSuperAdmin: checkIsSuperAdmin,
    canEdit: checkCanEdit,
    isLoading: !currentUser
  };
}
