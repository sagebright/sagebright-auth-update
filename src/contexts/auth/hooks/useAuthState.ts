
import { useState, useRef } from 'react';

/**
 * Hook for managing core authentication state
 */
export function useAuthState() {
  // Core auth state
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  
  // Flag to prevent multiple fetch attempts on unauthenticated state
  const hasTriedFetchingRef = useRef(false);

  // Reset auth state completely (useful for logout)
  const resetState = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
    setUserId(null);
    setOrgId(null);
    setOrgSlug(null);
    setCurrentUser(null);
    setAccessToken(null);
    hasTriedFetchingRef.current = false;
    setReady(true);
    setLoading(false);
  };

  // Update auth state with session data
  const updateSessionState = (authData: any) => {
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
    setLoading(false);
  };

  return {
    // State
    session,
    user,
    userId,
    orgId,
    orgSlug,
    currentUser,
    loading,
    isAuthenticated,
    accessToken,
    ready,
    
    // Setters
    setUser,
    setSession,
    setCurrentUser,
    setLoading,
    setAccessToken,
    setOrgId,
    setOrgSlug,
    
    // State management
    resetState,
    updateSessionState,
    hasTriedFetchingRef
  };
}
