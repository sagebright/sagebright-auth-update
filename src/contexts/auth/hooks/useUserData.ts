
import { useState, useEffect, useRef } from 'react';
import { fetchAuth } from '@/lib/backendAuth';

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
      console.log("🔍 Fetching user data from backend auth for ID:", userId);
      
      // Get user data from the backend auth endpoint
      const authData = await fetchAuth();
      
      if (!authData || !authData.user) {
        console.error('❌ Error fetching auth user data');
        fetchInProgressRef.current = false;
        return null;
      }
      
      // Extract essential user data
      const userData = {
        id: authData.user.id,
        role: authData.user.role,
        org_id: authData.org.id,
        // Add additional user fields as needed
      };
      
      console.log("✅ Received user data from backend auth:", {
        id: userData.id,
        role: userData.role,
        orgId: userData.org_id
      });
      
      setCurrentUser(userData);
      
      // Set org context from the auth data
      if (authData.org.id) {
        console.log("✅ Setting org ID from auth data:", authData.org.id);
        setOrgId(authData.org.id);
        await fetchOrgDetails(authData.org.id);
      }
      
      fetchInProgressRef.current = false;
      return userData;
    } catch (err) {
      console.error('Error loading user data:', err);
      fetchInProgressRef.current = false;
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
