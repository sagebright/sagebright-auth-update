
import { useState, useEffect, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { syncUserRole } from '@/lib/syncUserRole';
import { syncExistingUsers } from '@/lib/syncExistingUsers';
import { toast } from '@/components/ui/use-toast';

export function useSessionInit() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const lastFocusTimeRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);

  // Function to refresh the session when needed, with debounce and error handling
  const refreshSession = useCallback(async (reason: string) => {
    // Prevent concurrent refresh calls
    if (isRefreshingRef.current) {
      console.log(`🔄 Session refresh already in progress (skipping - reason: ${reason})`);
      return;
    }
    
    isRefreshingRef.current = true;
    const refreshCount = ++refreshCountRef.current;
    
    try {
      console.log(`🔄 Refreshing session #${refreshCount} (reason: ${reason}) at ${new Date().toISOString()}`);
      const { data, error } = await supabase.auth.getSession();
      
      // Check if this refresh is still relevant (not superseded by a newer one)
      if (refreshCount < refreshCountRef.current) {
        console.log(`🔄 Refresh #${refreshCount} superseded by newer refresh, discarding result`);
        isRefreshingRef.current = false;
        return;
      }
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setUserId(data.session.user.id);
        setAccessToken(data.session.access_token);
        setIsAuthenticated(true);
        console.log(`✅ Session #${refreshCount} refreshed successfully at ${new Date().toISOString()}`);
      } else if (user) {
        // We had a user before, but now session is gone - this is abnormal
        console.warn('⚠️ Session lost, but user state existed');
        setIsAuthenticated(false);
        
        toast({
          title: "Session expired",
          description: "Please refresh the page or sign in again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`❌ Error refreshing session #${refreshCount}:`, error);
      
      // If this is a critical operation, show a toast
      if (reason.includes('critical')) {
        toast({
          title: "Authentication error",
          description: "There was an issue with your session. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [user]);

  // Set up tab focus/blur event listeners with improved logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastFocus = Date.now() - lastFocusTimeRef.current;
        lastFocusTimeRef.current = Date.now();
        
        console.log(`👁️ Tab visibility changed to visible after ${timeSinceLastFocus}ms at ${new Date().toISOString()}`);
        
        // Always refresh on tab visibility change, regardless of time elapsed
        refreshSession('tab visibility change');
      }
    };

    const handleWindowFocus = () => {
      const timeSinceLastFocus = Date.now() - lastFocusTimeRef.current;
      lastFocusTimeRef.current = Date.now();
      
      console.log(`🔍 Window focused after ${timeSinceLastFocus}ms at ${new Date().toISOString()}`);
      
      // Always refresh on window focus, regardless of time elapsed
      refreshSession('window focus');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [refreshSession]);

  // Set up auth state change listener
  useEffect(() => {
    console.log("🔧 useSessionInit initializing");
    let isMounted = true;

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event, 'at', new Date().toISOString());
        
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
    refreshSession,
  };
}
