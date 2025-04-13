
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

  // Prioritize metadata-based hydration of orgId
  useEffect(() => {
    if (isAuthenticated && userId && !orgId) {
      const metadataOrgId = user?.user_metadata?.org_id;
      if (metadataOrgId) {
        console.log("✅ Hydrating orgId from session metadata:", metadataOrgId);
        setOrgId(metadataOrgId);
      }
    }
  }, [isAuthenticated, userId, orgId, user, setOrgId]);

  // Ensure we attempt to recover org context ONLY if metadata is also missing
  useEffect(() => {
    if (
      isAuthenticated &&
      userId &&
      !orgId &&
      !user?.user_metadata?.org_id &&
      !isRecoveringOrgContext
    ) {
      console.log("🔍 No orgId found anywhere—attempting recovery...");
      recoverOrgContext();
    }
  }, [isAuthenticated, userId, orgId, isRecoveringOrgContext, user, recoverOrgContext]);

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
