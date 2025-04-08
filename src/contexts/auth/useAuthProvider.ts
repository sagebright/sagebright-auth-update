
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user from backend once userId is known
  useEffect(() => {
    if (!userId) return;

    getUsers()
      .then(users => {
        const match = users.find(u => u.id === userId);
        setCurrentUser(match || null);
        setOrgId(match?.org_id || null);
        
        // Get org slug once we have the org ID
        if (match?.org_id) {
          getOrgById(match.org_id)
            .then(org => {
              if (org?.slug) {
                setOrgSlug(org.slug);
              }
            });
        }
      })
      .catch(err => {
        console.error('Error loading current user:', err);
      });
  }, [userId]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setUserId(session?.user?.id ?? null);
        
        // Handle org-based routing on auth state change
        if (event === 'SIGNED_IN' && session?.user) {
          const userOrgId = session.user.user_metadata?.org_id;
          if (userOrgId) {
            // Get org details including slug
            const orgDetails = await getOrgById(userOrgId);
            const orgSlug = orgDetails?.slug;
            
            if (orgSlug) {
              const currentOrgSlug = getOrgFromUrl();
              if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
                console.log('🏢 Redirecting to org subdomain:', orgSlug);
                // Store path for after subdomain redirect
                sessionStorage.setItem('lastAuthenticatedPath', 
                  localStorage.getItem("redirectAfterLogin") || '/user-dashboard');
                redirectToOrgUrl(orgSlug);
              }
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔥 Session in getSession():', session);

      setSession(session);
      setUser(session?.user ?? null);
      setUserId(session?.user?.id ?? null);
      setAccessToken(session?.access_token ?? null);
      
      // Check for organization-based routing on initial load
      if (session?.user) {
        const userOrgId = session.user.user_metadata?.org_id;
        if (userOrgId) {
          // Get org details including slug
          const orgDetails = await getOrgById(userOrgId);
          const orgSlug = orgDetails?.slug;
          
          if (orgSlug) {
            setOrgSlug(orgSlug);
            const currentOrgSlug = getOrgFromUrl();
            if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
              // Only redirect if not on auth pages
              if (!window.location.pathname.startsWith('/auth')) {
                console.log('🏢 Redirecting to org subdomain on load:', orgSlug);
                redirectToOrgUrl(orgSlug);
                setLoading(false);
                return;
              }
            }
          }
        }
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    accessToken,
    session,
    user,
    userId,
    orgId,
    orgSlug,
    currentUser,
    loading,
    setUser,
    setSession,
    setCurrentUser,
    setLoading,
    setAccessToken,
  };
}
