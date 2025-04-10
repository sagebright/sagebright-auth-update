
import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/backendApi';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useUserData(
  userId: string | null, 
  isAuthenticated: boolean, 
  setOrgId: (orgId: string | null) => void,
  fetchOrgDetails: (orgId: string) => Promise<void>,
  recoverOrgContext: (userId: string) => Promise<void>,
  isRecoveringOrgContext: boolean
) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  // Function to fetch user data from backend
  const fetchUserData = async (uid: string) => {
    try {
      console.log("🔍 Fetching user data for ID:", uid);
      const users = await getUsers();
      
      const match = users.find(u => u.id === uid);
      
      if (match) {
        console.log("👤 User found in database:", match.id);
        if (match.org_id) {
          console.log("🏢 User has org_id:", match.org_id);
          setOrgId(match.org_id);
          
          // Get org slug once we have the org ID
          await fetchOrgDetails(match.org_id);
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
    if (!userId || !isAuthenticated) {
      return;
    }
    
    let isMounted = true;
    
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData(userId);
        if (!isMounted) return;
        
        setCurrentUser(userData || null);
        
        // If we have a user but no org, there might be an issue with the user's org assignment
        if (userData && !userData.org_id && !isRecoveringOrgContext) {
          // Show user feedback if we're on a protected page
          if (!['/auth/login', '/auth/signup', '/auth/forgot-password'].includes(location.pathname)) {
            toast({
              variant: "destructive",
              title: "Organization Context Issue",
              description: "Unable to retrieve your organization context. Some features may be limited."
            });
          }
        }
      } catch (err) {
        console.error('Error loading current user:', err);
      }
    };
    
    loadUserData();
    
    return () => {
      isMounted = false;
    };
  }, [userId, isAuthenticated, isRecoveringOrgContext, location.pathname, toast, setOrgId, fetchOrgDetails]);

  return {
    currentUser,
    setCurrentUser,
    fetchUserData
  };
}
