
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { syncUserRole } from '@/lib/syncUserRole';
import { syncExistingUsers } from '@/lib/syncExistingUsers';

export function useSessionInit() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("🔧 useSessionInit initializing");
    let isMounted = true;

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event);
        
        if (!isMounted) return;
        
        setSession(session);
        
        // Important: Preserve the entire user object with metadata
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
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔥 Session in getSession():', session);
  
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
        } else {
          setLoading(false);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setLoading(false);
          setIsAuthenticated(false);
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
  };
}
