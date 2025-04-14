
import { useState, useEffect, useCallback } from 'react';
import { useInitialSession } from './useInitialSession';
import { useSessionRefresh } from './useSessionRefresh';
import { useVisibilityChange } from './useVisibilityChange';
import { supabase } from '@/lib/supabaseClient';

export function useSessionInit() {
  const {
    session,
    user,
    userId,
    accessToken,
    loading,
    isAuthenticated,
    setSession,
    setUser,
    setAccessToken,
    setLoading,
    setIsAuthenticated,
    initialAuthComplete
  } = useInitialSession();

  const {
    refreshSession,
    repairSessionMetadata,
    isRefreshing
  } = useSessionRefresh();

  const sessionLastCheckedRef = useState<number>(Date.now())[0];

  // Setup visibility change handlers
  useVisibilityChange({
    onVisible: () => {
      console.log('🔄 Refreshing session due to visibility change');
      refreshSession('tab visibility change');
    }
  });

  // Check for and repair missing metadata if needed
  useEffect(() => {
    if (isAuthenticated && user && userId && initialAuthComplete()) {
      // Verify user has required metadata
      if (!user.user_metadata?.role) {
        repairSessionMetadata(userId)
          .then(success => {
            if (success) {
              // Re-fetch the session to update our state
              supabase.auth.getSession().then(({ data }) => {
                if (data.session) {
                  setSession(data.session);
                  setUser(data.session.user);
                  console.log('✅ Session updated after metadata repair');
                }
              });
            }
          });
      }
    }
  }, [isAuthenticated, user, userId, initialAuthComplete, repairSessionMetadata, setSession, setUser]);

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
  };
}
