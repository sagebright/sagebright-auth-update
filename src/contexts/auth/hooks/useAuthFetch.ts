
import { useCallback } from 'react';
import { fetchAuth, resetAuthState } from '@/lib/backendAuth';
import { handleApiError } from '@/lib/handleApiError';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for handling auth API calls and session refresh
 */
export function useAuthFetch(authState: any) {
  // Fetch the authentication state from backend
  const fetchAuthState = useCallback(async (options: { force?: boolean } = {}) => {
    const { force = false } = options;
    
    // Skip fetch if already tried and not forcing
    if (authState.hasTriedFetchingRef.current && !force && !authState.isAuthenticated) {
      console.log("🔄 Skipping auth fetch - already tried without auth");
      authState.setLoading(false);
      authState.setReady(true);
      return;
    }
    
    try {
      console.log("🔄 Fetching auth state from backend...");
      authState.setLoading(true);
      
      const authData = await fetchAuth({ forceCheck: force });
      authState.hasTriedFetchingRef.current = true;
      
      // If no session data, set unauthenticated state
      if (!authData.session) {
        console.log("🔒 No session found, setting unauthenticated state");
        authState.resetState();
        return;
      }
      
      // Update session state
      authState.updateSessionState(authData);
      
      console.log("✅ Auth state successfully loaded", {
        userId: authData.user.id,
        orgId: authData.org.id,
        orgSlug: authData.org.slug,
        role: authData.user.role
      });
    } catch (error) {
      handleApiError(error, {
        context: 'auth-state',
        showToast: false, // Don't show toast on initial auth check to avoid spamming users
        silent: !force // Only silent if not a forced refresh
      });
      
      authState.hasTriedFetchingRef.current = true;
      authState.resetState();
    }
  }, [authState]);
  
  // Refresh the session
  const refreshSession = useCallback(async (reason = "manual refresh") => {
    console.log(`🔄 Refreshing auth session (reason: ${reason})`);
    try {
      await fetchAuthState({ force: true });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Session refresh failed",
        description: "Unable to refresh your session. Please try again."
      });
      return false;
    }
  }, [fetchAuthState]);
  
  // Reset auth state completely (useful for logout)
  const resetAuth = useCallback(() => {
    console.log("🔄 Resetting auth state");
    resetAuthState();
    authState.resetState();
  }, [authState]);

  return {
    fetchAuthState,
    refreshSession,
    resetAuth
  };
}
