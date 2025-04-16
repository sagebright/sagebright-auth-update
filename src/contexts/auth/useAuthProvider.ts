
import { useLocation } from 'react-router-dom';
import { useSessionInit } from './hooks/useSessionInit';
import { useOrgContext } from './hooks/useOrgContext';
import { useUserData } from './hooks/useUserData';
import { useEffect } from 'react';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

export function useAuthProvider() {
  const location = useLocation();
  const { captureIntent, executeRedirect } = useRedirectIntentManager({
    enableLogging: true,
    defaultPriority: 1
  });
  
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
    refreshSession,
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

  // Temporary fallback for missing orgSlug when orgId is present
  useEffect(() => {
    if (isAuthenticated && orgId && !orgSlug) {
      console.warn("⚠️ orgSlug missing, applying fallback");
      setOrgSlug("lumon"); // TEMP until dynamic slug lookup is implemented
    }
  }, [isAuthenticated, orgId, orgSlug, setOrgSlug]);

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
      
      // Capture this situation as an intent for debugging
      captureIntent(
        location.pathname + location.search,
        'session-restore',
        {
          source: 'org_recovery',
          userId,
          context: 'missing_org_id',
          pathname: location.pathname
        },
        1
      );
      
      recoverOrgContext();
    }
  }, [isAuthenticated, userId, orgId, isRecoveringOrgContext, user, recoverOrgContext, location, captureIntent]);

  // Enhanced logging for auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔐 Auth provider state:", { 
        userId, 
        orgId, 
        orgSlug,
        userMetadata: user?.user_metadata,
        currentUserData: currentUser,
        sessionReady: !!user,
        currentUserReady: !!currentUser,
        path: location.pathname
      });
      
      // Add additional log to trace final auth context before page rendering
      console.log("🏷️ Final auth context before rendering:", {
        userId,
        orgId,
        orgSlug,
        userMetadata: user?.user_metadata,
        sessionUserReady: !!user,
        currentUserReady: !!currentUser,
        hasSessionMetadata: user ? !!user.user_metadata : false,
        path: location.pathname
      });
    }
  }, [isAuthenticated, userId, orgId, orgSlug, user, currentUser, location.pathname]);

  // Combined setter for current user to update both contexts
  const setCurrentUser = (userData: any | null) => {
    // Ensure we don't lose user_metadata when updating user data
    if (userData && user && user.user_metadata) {
      if (!userData.user_metadata) {
        userData.user_metadata = user.user_metadata;
      }
    }
    
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
    fetchUserData,
    refreshSession, // Expose refreshSession
  };
}
