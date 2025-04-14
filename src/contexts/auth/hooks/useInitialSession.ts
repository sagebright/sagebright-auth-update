
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { syncUserRole } from '@/lib/syncUserRole';
import { syncExistingUsers } from '@/lib/syncExistingUsers';

export function useInitialSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initialAuthCompleteRef = useRef<boolean>(false);
  
  // Set up auth state change listener
  useEffect(() => {
    console.log("🔧 useInitialSession initializing");
    let isMounted = true;

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event, 'at', new Date().toISOString());
        
        if (!isMounted) return;
        
        setSession(session);
        
        // Preserve the entire user object with metadata
        if (session?.user) {
          console.log('🔑 User metadata in onAuthStateChange:', session.user.user_metadata);
          setUser(session.user);
        } else {
          setUser(null);
        }
        
        setUserId(session?.user?.id ?? null);
        setAccessToken(session?.access_token ?? null);
        
        // Set authentication state immediately based on session
        if (session && session.user) {
          setIsAuthenticated(true);
          
          // If this is a sign-in event, sync the user role
          if (event === 'SIGNED_IN') {
            console.log("🔑 Login successful, syncing user role for ID:", session.user.id);
            try {
              await syncUserRole(session.user.id);
              console.log("✅ User role synchronized after login");
              
              // Force refresh the session to get updated metadata
              try {
                const { data: refreshData } = await supabase.auth.refreshSession();
                if (refreshData.session && isMounted) {
                  setSession(refreshData.session);
                  // Preserve the entire user object with metadata
                  console.log('🔄 User metadata after refresh:', refreshData.session.user.user_metadata);
                  setUser(refreshData.session.user);
                }
              } catch (refreshError) {
                console.error("❌ Error refreshing session:", refreshError);
              }
              
              // Also sync existing users to ensure db consistency
              console.log("🔄 Manually syncing existing users to users table");
              try {
                const { data } = await supabase.functions.invoke('database-triggers');
                console.log("✅ Successfully called database-triggers:", data);
                console.log("✅ User synchronized to users table after login");
              } catch (error) {
                console.error("❌ Error calling database-triggers:", error);
              }
            } catch (error) {
              console.error("❌ Error syncing user role after login:", error);
            }
          }
        }
        
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    // Then check for an existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log('🔥 Session in getSession():', session ? 'Found' : 'Not found', 'at', new Date().toISOString());
  
        if (!isMounted) return;
  
        setSession(session);
        
        // Preserve the entire user object with metadata
        if (session?.user) {
          console.log('🔑 User metadata in getSession:', session.user.user_metadata);
          setUser(session.user);
        } else {
          setUser(null);
        }
        
        setUserId(session?.user?.id ?? null);
        setAccessToken(session?.access_token ?? null);
        
        // Set authentication state immediately based on session
        if (session && session.user) {
          setIsAuthenticated(true);
          
          // Verify role is present in metadata - critical for redirect logic
          if (!session.user.user_metadata?.role && session.user.id) {
            console.warn('⚠️ User metadata missing role, syncing role');
            try {
              await syncUserRole(session.user.id);
              console.log('✅ Role synchronized on init');
              
              // Refresh session to get updated metadata
              const { data: refreshData } = await supabase.auth.getSession();
              if (refreshData.session && isMounted) {
                setSession(refreshData.session);
                setUser(refreshData.session.user);
                console.log('🔄 User metadata after role sync:', refreshData.session.user.user_metadata);
              }
            } catch (syncError) {
              console.error('❌ Role sync failed on init:', syncError);
            }
          }
        } else {
          setLoading(false);
          setIsAuthenticated(false);
        }
        
        // Mark initial auth as complete regardless of outcome
        initialAuthCompleteRef.current = true;
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setLoading(false);
          setIsAuthenticated(false);
          initialAuthCompleteRef.current = true;
        }
      }
    };
    
    checkSession();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    userId,
    accessToken,
    loading,
    isAuthenticated,
    setSession,
    setUser,
    setLoading,
    setAccessToken,
    setIsAuthenticated,
    initialAuthComplete: () => initialAuthCompleteRef.current
  };
}
