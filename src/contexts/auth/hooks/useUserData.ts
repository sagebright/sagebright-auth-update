
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUserData(
  userId: string | null, 
  isAuthenticated: boolean, 
  setOrgId: (orgId: string | null) => void,
  fetchOrgDetails: (orgId: string) => Promise<void>
) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const fetchInProgressRef = useRef(false);
  const hasAttemptedFetchRef = useRef(false);

  // Function to explicitly fetch user data when needed
  const fetchUserData = async () => {
    if (!userId || !isAuthenticated || fetchInProgressRef.current) {
      return null;
    }
    
    // Set flag to prevent multiple simultaneous fetches
    fetchInProgressRef.current = true;
    hasAttemptedFetchRef.current = true;
    
    try {
      console.log("🔍 Fetching user data from auth for ID:", userId);
      
      // Get user metadata directly from Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData?.user) {
        console.error('❌ Error fetching auth user:', authError);
        fetchInProgressRef.current = false;
        return null;
      }
      
      // Extract essential user data from auth metadata
      const userRole = authData.user.user_metadata?.role || 'user';
      const orgIdFromMetadata = authData.user.user_metadata?.org_id;
      
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        role: userRole,
        full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User',
        org_id: orgIdFromMetadata || null
      };
      
      setCurrentUser(userData);
      
      // If org_id is present in user metadata, use it to set org context
      if (orgIdFromMetadata) {
        console.log("✅ Found org_id in user metadata:", orgIdFromMetadata);
        setOrgId(orgIdFromMetadata);
        await fetchOrgDetails(orgIdFromMetadata);
      } else {
        // If not in metadata, try database only if we haven't found it yet
        await fetchUserFromDatabase(userId);
      }
      
      fetchInProgressRef.current = false;
      return userData;
    } catch (err) {
      console.error('Error loading user data:', err);
      fetchInProgressRef.current = false;
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

  // Load user data only once when component mounts and userId/auth state changes
  useEffect(() => {
    if (!userId || !isAuthenticated || hasAttemptedFetchRef.current) {
      return;
    }
    
    let isMounted = true;
    
    const loadUserFromAuth = async () => {
      try {
        if (isMounted) {
          await fetchUserData();
        }
      } catch (err) {
        console.error('Error loading user from auth:', err);
      }
    };
    
    loadUserFromAuth();
    
    return () => {
      isMounted = false;
    };
  }, [userId, isAuthenticated]);

  return {
    currentUser,
    setCurrentUser,
    fetchUserData
  };
}
