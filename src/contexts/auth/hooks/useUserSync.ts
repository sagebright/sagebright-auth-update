
import { useCallback } from 'react';
import { handleApiError } from '@/lib/handleApiError';

/**
 * Hook for synchronizing user data from the backend
 */
export function useUserSync(authState: any, fetchAuthState: any) {
  // Fetch user data if needed
  const fetchUserData = useCallback(async () => {
    if (!authState.userId || !authState.isAuthenticated) return null;
    
    console.log("🔄 Syncing user data from backend");
    try {
      await fetchAuthState({ force: true });
      return authState.currentUser;
    } catch (error) {
      handleApiError(error, {
        context: 'user-data-sync',
        showToast: true,
        fallbackMessage: 'Unable to sync your user data. Please try again.'
      });
      
      return null;
    }
  }, [authState.userId, authState.isAuthenticated, authState.currentUser, fetchAuthState]);

  return {
    fetchUserData
  };
}
