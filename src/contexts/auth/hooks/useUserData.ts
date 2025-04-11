
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUserData(
  userId: string | null, 
  isAuthenticated: boolean, 
  setOrgId: (orgId: string | null) => void,
  fetchOrgDetails: (orgId: string) => Promise<void>
) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Load user from auth metadata as the primary source of truth
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      return;
    }
    
    let isMounted = true;
    
    const loadUserFromAuth = async () => {
      try {
        // Get user metadata directly from Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authData?.user) {
          console.error('❌ Error fetching auth user:', authError);
          return;
        }
        
        if (!isMounted) return;
        
        // Extract essential user data from auth metadata
        const userRole = authData.user.user_metadata?.role || 'user';
        const userData = {
          id: authData.user.id,
          email: authData.user.email,
          role: userRole,
          full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User',
          org_id: authData.user.user_metadata?.org_id || null
        };
        
        setCurrentUser(userData);
        
        // If org_id is present in user metadata, use it to set org context
        if (userData.org_id) {
          setOrgId(userData.org_id);
          await fetchOrgDetails(userData.org_id);
        }
      } catch (err) {
        console.error('Error loading user from auth:', err);
      }
    };
    
    loadUserFromAuth();
    
    return () => {
      isMounted = false;
    };
  }, [userId, isAuthenticated, setOrgId, fetchOrgDetails]);

  return {
    currentUser,
    setCurrentUser
  };
}
