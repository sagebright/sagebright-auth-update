
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { getUsers } from '@/lib/backendApi';
import { useToast } from '@/hooks/use-toast';
import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Load user from backend once userId is known
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        const users = await getUsers();
        if (!isMounted) return;
        
        const match = users.find(u => u.id === userId);
        setCurrentUser(match || null);
        
        if (match?.org_id) {
          setOrgId(match.org_id);
          
          // Get org slug once we have the org ID
          const org = await getOrgById(match.org_id);
          if (!isMounted) return;
          
          if (org?.slug) {
            setOrgSlug(org.slug);
            console.log("🏢 Set orgSlug in useAuthProvider:", org.slug);
            // Only now set isAuthenticated when we have the complete context
            setIsAuthenticated(true);
          } else {
            console.warn("⚠️ No slug found for org ID:", match.org_id);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error loading current user:', err);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

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
        
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setOrgId(null);
          setOrgSlug(null);
          setCurrentUser(null);
        }
        
        // Note: We now handle all redirection in the useRequireAuth hook
        // This makes the redirection logic more centralized and predictable
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
        
        // User data and org fetching is now handled in the userId useEffect
        // We only manage the session state here
        if (!session) {
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
  };
}
