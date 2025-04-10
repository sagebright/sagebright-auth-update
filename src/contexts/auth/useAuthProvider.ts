
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { getUsers } from '@/lib/backendApi';
import { useToast } from '@/hooks/use-toast';
import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';
import { syncUserRole } from '@/lib/syncUserRole';

export function useAuthProvider() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Function to fetch user data from backend
  const fetchUserData = async (uid: string) => {
    let isMounted = true;
    try {
      console.log("🔍 Fetching user data for ID:", uid);
      const users = await getUsers();
      if (!isMounted) return null;
      
      const match = users.find(u => u.id === uid);
      
      if (match) {
        console.log("👤 User found in database:", match.id);
        if (match.org_id) {
          console.log("🏢 User has org_id:", match.org_id);
          setOrgId(match.org_id);
          
          // Get org slug once we have the org ID
          const org = await getOrgById(match.org_id);
          if (!isMounted) return null;
          
          if (org?.slug) {
            setOrgSlug(org.slug);
            console.log("🏢 Set orgSlug in useAuthProvider:", org.slug);
          } else {
            console.warn("⚠️ No slug found for org ID:", match.org_id);
          }
        } else {
          console.warn("⚠️ User found but no org assigned:", uid);
        }
        return match;
      } else {
        console.warn("⚠️ User not found in database:", uid);
        return null;
      }
    } catch (err) {
      console.error('❌ Error loading current user:', err);
      return null;
    }
  };

  // Load user from backend once userId is known
  useEffect(() => {
    if (!userId) {
      // If no userId, we're definitely not authenticated
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }
    
    // Mark as authenticated if we have a userId - this is critical
    // We set this early so login flows can continue
    setIsAuthenticated(true);
    
    let isMounted = true;
    
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData(userId);
        if (!isMounted) return;
        
        setCurrentUser(userData || null);
        
        // If we have a user but no org, there might be an issue with the user's org assignment
        if (userData && !userData.org_id && !isRecoveringOrgContext) {
          console.log("👤 User found but no org assigned. Attempting to sync role...");
          setIsRecoveringOrgContext(true);
          
          // Try to force sync the user's role to ensure org_id is updated
          try {
            await syncUserRole(userId);
            console.log("✅ Role sync attempted for user without org_id");
            
            // Try fetching user data again after role sync
            const usersAfterSync = await getUsers();
            if (!isMounted) return;
            
            const matchAfterSync = usersAfterSync.find(u => u.id === userId);
            if (matchAfterSync?.org_id) {
              setOrgId(matchAfterSync.org_id);
              console.log("✅ Org ID retrieved after role sync:", matchAfterSync.org_id);
              
              // Get org slug for the newly found org_id
              const orgAfterSync = await getOrgById(matchAfterSync.org_id);
              if (!isMounted) return;
              
              if (orgAfterSync?.slug) {
                setOrgSlug(orgAfterSync.slug);
                console.log("🏢 Set orgSlug after role sync:", orgAfterSync.slug);
              }
              
              // Update the current user with the new data
              setCurrentUser(matchAfterSync);
            } else {
              console.warn("⚠️ Still no org_id found after role sync");
              
              // Show user feedback if we're on a protected page
              if (!['/auth/login', '/auth/signup', '/auth/forgot-password'].includes(location.pathname)) {
                toast({
                  variant: "destructive",
                  title: "Organization Context Issue",
                  description: "Unable to retrieve your organization context. Some features may be limited."
                });
              }
            }
          } catch (syncError) {
            console.error("❌ Error syncing role:", syncError);
          } finally {
            setIsRecoveringOrgContext(false);
          }
        }
      } catch (err) {
        console.error('Error loading current user:', err);
        // Despite the error, we're still authenticated at the Supabase level
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadUserData();
    
    return () => {
      isMounted = false;
    };
  }, [userId, location.pathname, toast, isRecoveringOrgContext]);

  useEffect(() => {
    console.log("🔧 useAuthProvider initializing on path:", location.pathname);
    let isMounted = true;

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event);
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
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
                if (refreshData.session) {
                  setSession(refreshData.session);
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
          setOrgId(null);
          setOrgSlug(null);
          setCurrentUser(null);
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
        setUser(session?.user ?? null);
        setUserId(session?.user?.id ?? null);
        setAccessToken(session?.access_token ?? null);
        
        // Set authentication state immediately based on session
        if (session && session.user) {
          setIsAuthenticated(true);
        } else {
          setLoading(false);
          setIsAuthenticated(false);
        }
        // User data and org fetching is now handled in the userId useEffect
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
  }, [navigate, location.pathname]);

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
  };
}
