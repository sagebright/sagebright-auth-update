
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFetch } from './hooks/useAuthFetch';
import { useOrgRecovery } from './hooks/useOrgRecovery';
import { useUserSync } from './hooks/useUserSync';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

export function useAuthProvider() {
  const location = useLocation();
  const { captureIntent } = useRedirectIntentManager({
    enableLogging: true,
    defaultPriority: 1
  });
  
  // Combine all the specialized hooks
  const authState = useAuthState();
  const { fetchAuthState, refreshSession, resetAuth } = useAuthFetch(authState);
  const { isRecoveringOrgContext, recoverOrgContext } = useOrgRecovery(authState, fetchAuthState);
  const { fetchUserData } = useUserSync(authState, fetchAuthState);
  
  // Initialize auth state when component mounts
  useEffect(() => {
    console.log("🔧 Auth provider initializing");
    fetchAuthState();
    
    return () => {
      // Clean up any pending operations
      console.log("🧹 Auth provider cleanup");
    };
  }, [fetchAuthState]);

  // Enhanced logging for auth state changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      console.log("🔐 Auth provider state:", { 
        userId: authState.userId, 
        orgId: authState.orgId, 
        orgSlug: authState.orgSlug,
        userMetadata: authState.user?.user_metadata,
        currentUserReady: !!authState.currentUser,
        sessionReady: !!authState.session,
        path: location.pathname
      });
    }
  }, [
    authState.isAuthenticated, 
    authState.userId, 
    authState.orgId, 
    authState.orgSlug, 
    authState.user, 
    authState.currentUser, 
    authState.session, 
    location.pathname
  ]);

  return {
    // Pass through all the state from authState
    accessToken: authState.accessToken,
    session: authState.session,
    user: authState.user,
    userId: authState.userId,
    orgId: authState.orgId,
    orgSlug: authState.orgSlug,
    currentUser: authState.currentUser,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    
    // Pass through setters
    setUser: authState.setUser,
    setSession: authState.setSession,
    setCurrentUser: authState.setCurrentUser,
    setLoading: authState.setLoading,
    setAccessToken: authState.setAccessToken,
    
    // Add utility functions
    isRecoveringOrgContext,
    recoverOrgContext,
    fetchUserData,
    refreshSession,
    resetAuth,
    sessionUserReady: authState.ready
  };
}
