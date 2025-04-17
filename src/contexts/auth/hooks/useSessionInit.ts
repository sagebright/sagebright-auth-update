
import { useState, useEffect, useCallback } from 'react';
import { useSessionRefresh } from './useSessionRefresh';
import { useVisibilityChange } from './useVisibilityChange';
import { fetchAuth } from '@/lib/backendAuth';

export function useSessionInit() {
  // Auth state
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthComplete, setInitialAuthComplete] = useState(false);

  const sessionLastCheckedRef = useState<number>(Date.now())[0];

  // Get session refresh functionality
  const {
    refreshSession,
    isRefreshing
  } = useSessionRefresh();

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🔄 Initializing auth session');
      setLoading(true);
      
      const authData = await fetchAuth();
      
      // Update session state
      const sessionObj = {
        id: authData.session.id,
        expiresAt: authData.session.expiresAt,
        access_token: authData.session.id
      };
      setSession(sessionObj);
      
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
      setAccessToken(authData.session.id);
      setIsAuthenticated(true);
      
      console.log('✅ Auth session initialized:', {
        userId: authData.user.id,
        orgId: authData.org.id
      });
    } catch (error) {
      console.error('❌ Error fetching auth session:', error);
      setSession(null);
      setUser(null);
      setUserId(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setInitialAuthComplete(true);
    }
  }, []);

  // Initialize on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Setup visibility change handlers
  useVisibilityChange({
    onVisible: () => {
      console.log('🔄 Refreshing session due to visibility change');
      refreshSession('tab visibility change');
    }
  });

  return {
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
    initialAuthComplete: () => initialAuthComplete
  };
}
