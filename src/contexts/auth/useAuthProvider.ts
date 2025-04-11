
import { useLocation } from 'react-router-dom';
import { useSessionInit } from './hooks/useSessionInit';
import { useOrgContext } from './hooks/useOrgContext';
import { useUserData } from './hooks/useUserData';
import { useEffect } from 'react';

export function useAuthProvider() {
  const location = useLocation();
  
  // Initialize the session and auth state
  const {
    accessToken,
    session,
    user,
    userId,
    loading,
    isAuthenticated,
    setSession,
    setUser,
    setLoading,
    setAccessToken,
  } = useSessionInit();

  // Initialize organization context
  const {
    orgId,
    orgSlug,
    setOrgId,
    setOrgSlug,
    setCurrentUser: setOrgContextUser,
    fetchOrgDetails,
    recoverOrgContext,
    isRecoveringOrgContext,
  } = useOrgContext(userId, isAuthenticated);

  // Load and manage user data
  const {
    currentUser,
    setCurrentUser: setUserDataCurrentUser,
    fetchUserData
  } = useUserData(
    userId, 
    isAuthenticated, 
    setOrgId, 
    fetchOrgDetails
  );

  // Ensure we attempt to recover org context if needed
  useEffect(() => {
    if (isAuthenticated && userId && !orgId && !isRecoveringOrgContext) {
      console.log("🔍 No orgId detected, attempting recovery...");
      const attemptRecovery = async () => {
        await recoverOrgContext();
      };
      attemptRecovery();
    }
  }, [isAuthenticated, userId, orgId, isRecoveringOrgContext]);

  // For debugging
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔐 Auth provider state:", { 
        userId, 
        orgId, 
        orgSlug,
        userMetadata: user?.user_metadata
      });
    }
  }, [isAuthenticated, userId, orgId, orgSlug, user]);

  // Combined setter for current user to update both contexts
  const setCurrentUser = (userData: any | null) => {
    setUserDataCurrentUser(userData);
    setOrgContextUser(userData);
  };

  return {
    accessToken,
    session,
    user,
    userId,
    orgId,
    orgSlug,
    currentUser,
    loading,
    isAuthenticated,
    setUser,
    setSession,
    setCurrentUser,
    setLoading,
    setAccessToken,
    isRecoveringOrgContext,
    recoverOrgContext,
    fetchUserData
  };
}
