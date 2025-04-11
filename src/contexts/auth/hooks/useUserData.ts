
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUserData(
  userId: string | null, 
  isAuthenticated: boolean, 
  setOrgId: (orgId: string | null) => void,
  fetchOrgDetails: (orgId: string) => Promise<void>
) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Function to explicitly fetch user data when needed
  const fetchUserData = async () => {
    if (!userId || !isAuthenticated) {
      return null;
    }
    
    try {
      // Get user metadata directly from Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData?.user) {
        console.error('❌ Error fetching auth user:', authError);
        return null;
      }
      
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
      } else {
        // If not in metadata, try database
        await fetchUserFromDatabase(userId);
      }
      
      return userData;
    } catch (err) {
      console.error('Error loading user data:', err);
      return null;
    }
  };
  
  // Try to fetch user data from database if not in metadata
  const fetchUserFromDatabase = async (userId: string) => {
    try {
      console.log('🔍 Fetching user data from database for ID:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, org_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('⚠️ User not found in database:', userId);
        return null;
      }
      
      if (data && data.org_id) {
        console.log('✅ Found user with org_id in database:', data.org_id);
        setOrgId(data.org_id);
        await fetchOrgDetails(data.org_id);
        
        // Update user metadata with org_id for faster access next time
        try {
          await supabase.auth.updateUser({
            data: { org_id: data.org_id }
          });
          console.log('✅ Updated user metadata with org_id from database');
        } catch (updateError) {
          console.warn('⚠️ Could not update user metadata:', updateError);
        }
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching user from database:', err);
      return null;
    }
  };

  // Load user from auth metadata as the primary source of truth
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      return;
    }
    
    let isMounted = true;
    
    const loadUserFromAuth = async () => {
      try {
        const userData = await fetchUserData();
        if (!isMounted || !userData) return;
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
    setCurrentUser,
    fetchUserData
  };
}
