
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAuth, resetAuthState } from '@/lib/backendAuth';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { handleApiError } from '@/lib/handleApiError';
import { toast } from '@/hooks/use-toast';

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
  
  // Flag to prevent multiple fetch attempts on unauthenticated state
  const hasTriedFetchingRef = useRef(false);
  
  // Fetch the authentication state from backend
  const fetchAuthState = useCallback(async (options: { force?: boolean } = {}) => {
    const { force = false } = options;
    
    // Skip fetch if already tried and not forcing
    if (hasTriedFetchingRef.current && !force && !isAuthenticated) {
      console.log("🔄 Skipping auth fetch - already tried without auth");
      setLoading(false);
      setReady(true);
      return;
    }
    
    try {
      console.log("🔄 Fetching auth state from backend...");
      setLoading(true);
      
      const authData = await fetchAuth({ forceCheck: force });
      hasTriedFetchingRef.current = true;
      
      // If no session data, set unauthenticated state
      if (!authData.session) {
        console.log("🔒 No session found, setting unauthenticated state");
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        setUserId(null);
        setOrgId(null);
        setOrgSlug(null);
        setCurrentUser(null);
        setReady(true);
        setLoading(false);
        return;
      }
      
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
      handleApiError(error, {
        context: 'auth-state',
        showToast: false, // Don't show toast on initial auth check to avoid spamming users
        silent: !force // Only silent if not a forced refresh
      });
      
      hasTriedFetchingRef.current = true;
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
  }, [isAuthenticated]);
  
  // Initialize auth state when component mounts
  useEffect(() => {
    console.log("🔧 Auth provider initializing");
    fetchAuthState();
    
    return () => {
      // Clean up any pending operations
      console.log("🧹 Auth provider cleanup");
    };
  }, [fetchAuthState]);
  
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
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
    setUserId(null);
    setOrgId(null);
    setOrgSlug(null);
    setCurrentUser(null);
    hasTriedFetchingRef.current = false;
    setReady(true);
  }, []);
  
  // Recover org context if needed
  const recoverOrgContext = useCallback(async () => {
    if (!userId || !isAuthenticated) return false;
    
    setIsRecoveringOrgContext(true);
    try {
      console.log("🔄 Attempting to recover org context");
      await fetchAuthState({ force: true });
      const success = !!orgId;
      setIsRecoveringOrgContext(false);
      
      if (success) {
        toast({
          title: "Organization context recovered",
          description: "Your organization context has been restored successfully."
        });
      }
      
      return success;
    } catch (error) {
      handleApiError(error, {
        context: 'org-context-recovery',
        showToast: true,
        fallbackMessage: 'Unable to recover organization context. Please try signing out and back in.'
      });
      
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
        currentUserReady: !!currentUser,
        sessionReady: !!session,
        path: location.pathname
      });
    }
  }, [isAuthenticated, userId, orgId, orgSlug, user, currentUser, session, location.pathname]);
  
  // Fetch user data if needed
  const fetchUserData = useCallback(async () => {
    if (!userId || !isAuthenticated) return null;
    
    console.log("🔄 Syncing user data from backend");
    try {
      await fetchAuthState({ force: true });
      return currentUser;
    } catch (error) {
      handleApiError(error, {
        context: 'user-data-sync',
        showToast: true,
        fallbackMessage: 'Unable to sync your user data. Please try again.'
      });
      
      return null;
    }
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
    resetAuth,
    sessionUserReady: ready
  };
}
