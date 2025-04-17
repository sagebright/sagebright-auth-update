
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrgById } from '@/lib/subdomainUtils';
import { fetchAuth } from '@/lib/backendAuth';

// A more resilient version of useOrgContext that uses the backend auth endpoint
export function useOrgContext(userId: string | null, isAuthenticated: boolean) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const fetchInProgressRef = useRef(false);
  const { toast } = useToast();
  
  // First try to get org context from auth endpoint when userId is available
  useEffect(() => {
    if (!userId || !isAuthenticated || fetchInProgressRef.current) return;
    
    const getOrgFromBackend = async () => {
      if (fetchInProgressRef.current) return;
      fetchInProgressRef.current = true;
      
      try {
        // Get user and org data from auth endpoint
        const authData = await fetchAuth();
        if (!authData) {
          console.warn('⚠️ Unable to get auth data for org context');
          fetchInProgressRef.current = false;
          return;
        }
        
        console.log("🔍 Received auth data for org context:", { 
          orgId: authData.org.id, 
          orgSlug: authData.org.slug
        });
        
        // Update org context
        setOrgId(authData.org.id);
        setOrgSlug(authData.org.slug);
        
        fetchInProgressRef.current = false;
      } catch (err) {
        console.error("❌ Error getting org context from backend:", err);
        fetchInProgressRef.current = false;
      }
    };
    
    getOrgFromBackend();
  }, [userId, isAuthenticated]);
  
  // Function to fetch org details when org ID is available
  const fetchOrgDetails = async (orgId: string) => {
    try {
      const org = await getOrgById(orgId);
      if (org?.slug) {
        setOrgSlug(org.slug);
        console.log("🏢 Set orgSlug from API in useOrgContext:", org.slug);
      } else {
        console.warn("⚠️ No slug found for org ID:", orgId);
        
        // If no slug was found, set a fallback
        console.log("⚠️ Using fallback slug for development context");
        setOrgSlug("default-org");
      }
      
      console.log("[useOrgContext] Final orgSlug:", orgSlug);
    } catch (error) {
      console.error("❌ Error fetching org details:", error);
      
      // Set fallback slug on error to prevent blocking
      setOrgSlug("default-org");
    }
  };
  
  // Function to recover org context from backend
  const recoverOrgContext = async () => {
    if (!userId || !isAuthenticated) return false;
    
    setIsRecoveringOrgContext(true);
    
    try {
      console.log("🔄 Attempting to recover org context for user:", userId);
      
      // Try to get auth data
      const authData = await fetchAuth();
      
      if (authData && authData.org) {
        console.log("✅ Found org context in auth data:", authData.org);
        setOrgId(authData.org.id);
        setOrgSlug(authData.org.slug);
        
        toast({
          title: "Organization Recovered",
          description: "Your organization context has been restored.",
        });
        
        setIsRecoveringOrgContext(false);
        return true;
      }
      
      console.log("⚠️ No org context found in auth data");
      setIsRecoveringOrgContext(false);
      return false;
    } catch (error) {
      console.error("❌ Error recovering org context:", error);
      setIsRecoveringOrgContext(false);
      return false;
    }
  };

  // Add a final check to log the finalized org context when it's fully loaded
  useEffect(() => {
    if (orgId && orgSlug) {
      console.log("[useOrgContext] Final org context:", {
        orgId,
        orgSlug,
        isAuthenticated,
        userId
      });
    }
  }, [orgId, orgSlug, isAuthenticated, userId]);

  return {
    orgId,
    orgSlug,
    currentUser,
    setOrgId,
    setOrgSlug,
    setCurrentUser,
    fetchOrgDetails,
    recoverOrgContext,
    isRecoveringOrgContext,
  };
}
