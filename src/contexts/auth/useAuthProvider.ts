
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { fetchAuth } from '@/lib/backendAuth';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

export function useAuthProvider() {
  const location = useLocation();
  const { captureIntent } = useRedirectIntentManager({
    enableLogging: true,
    defaultPriority: 1
  });
  
  // Auth state
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const [ready, setReady] = useState(false);
  
  // Fetch the authentication state from backend
  const fetchAuthState = useCallback(async () => {
    try {
      console.log("🔄 Fetching auth state from backend...");
      setLoading(true);
      
      const authData = await fetchAuth();
      
      // Update session state
      setSession(authData.session);
      
      // Update user state
      const userData = {
        id: authData.user.id,
        role: authData.user.role,
        // Set up user metadata for compatibility
        user_metadata: {
          role: authData.user.role,
          org_id: authData.org.id,
          org_slug: authData.org.slug
        }
      };
      
      setUser(userData);
      setUserId(authData.user.id);
      setCurrentUser(userData);
      
      // Update org state
      setOrgId(authData.org.id);
      setOrgSlug(authData.org.slug);
      
      // Update auth state
      setIsAuthenticated(true);
      setAccessToken(authData.session.id);
      setReady(true);
      
      console.log("✅ Auth state successfully loaded", {
        userId: authData.user.id,
        orgId: authData.org.id,
        orgSlug: authData.org.slug,
        role: authData.user.role
      });
    } catch (error) {
      console.error("❌ Error fetching auth state:", error);
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      setUserId(null);
      setOrgId(null);
      setOrgSlug(null);
      setCurrentUser(null);
      setReady(true);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initialize auth state when component mounts
  useEffect(() => {
    console.log("🔧 Auth provider initializing");
    fetchAuthState();
  }, [fetchAuthState]);
  
  // Refresh the session
  const refreshSession = useCallback(async () => {
    console.log("🔄 Refreshing auth session");
    await fetchAuthState();
  }, [fetchAuthState]);
  
  // Recover org context if needed
  const recoverOrgContext = useCallback(async () => {
    if (!userId || !isAuthenticated) return false;
    
    setIsRecoveringOrgContext(true);
    try {
      console.log("🔄 Attempting to recover org context");
      await fetchAuthState();
      const success = !!orgId;
      setIsRecoveringOrgContext(false);
      return success;
    } catch (error) {
      console.error("❌ Error recovering org context:", error);
      setIsRecoveringOrgContext(false);
      return false;
    }
  }, [userId, isAuthenticated, orgId, fetchAuthState]);
  
  // Enhanced logging for auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔐 Auth provider state:", { 
        userId, 
        orgId, 
        orgSlug,
        userMetadata: user?.user_metadata,
        currentUserData: currentUser,
        sessionReady: !!session,
        currentUserReady: !!currentUser,
        path: location.pathname
      });
    }
  }, [isAuthenticated, userId, orgId, orgSlug, user, currentUser, session, location.pathname]);
  
  // Sync fetch data from user profile if needed
  const fetchUserData = useCallback(async () => {
    if (!userId || !isAuthenticated) return null;
    console.log("🔄 Syncing user data from backend");
    await fetchAuthState();
    return currentUser;
  }, [userId, isAuthenticated, fetchAuthState, currentUser]);

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
    refreshSession,
    sessionUserReady: ready
  };
}
