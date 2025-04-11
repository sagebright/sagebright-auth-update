
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrgById } from '@/lib/subdomainUtils';
import { supabase } from '@/lib/supabaseClient';

// A more resilient version of useOrgContext that prioritizes user metadata
export function useOrgContext(userId: string | null, isAuthenticated: boolean) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const { toast } = useToast();
  
  // First try to get org context from user metadata when userId is available
  useEffect(() => {
    if (!userId || !isAuthenticated) return;
    
    const getOrgFromUserMetadata = async () => {
      try {
        // Get user data from auth
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.warn('⚠️ Unable to get user data for org context:', error);
          return;
        }
        
        // Check if user metadata contains org_id
        const metadata = data.user.user_metadata || {};
        const orgIdFromMetadata = metadata.org_id;
        
        if (orgIdFromMetadata) {
          console.log("🏢 Found org_id in user metadata:", orgIdFromMetadata);
          setOrgId(orgIdFromMetadata);
          await fetchOrgDetails(orgIdFromMetadata);
        } else {
          console.log("⚠️ No org_id found in user metadata, will try database");
          // If not in metadata, try to get from database
          await fetchOrgFromDatabase(userId);
        }
      } catch (err) {
        console.error("❌ Error getting org context from metadata:", err);
      }
    };
    
    getOrgFromUserMetadata();
  }, [userId, isAuthenticated]);
  
  // Function to fetch org details when org ID is available
  const fetchOrgDetails = async (orgId: string) => {
    try {
      const org = await getOrgById(orgId);
      if (org?.slug) {
        setOrgSlug(org.slug);
        console.log("🏢 Set orgSlug in useOrgContext:", org.slug);
      } else {
        console.warn("⚠️ No slug found for org ID:", orgId);
      }
    } catch (error) {
      console.error("❌ Error fetching org details:", error);
    }
  };
  
  // Function to fetch org ID from database if not in metadata
  const fetchOrgFromDatabase = async (userId: string) => {
    try {
      console.log("🔍 Trying to fetch org context from users table for:", userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("⚠️ Error fetching user org data:", error);
        return;
      }
      
      if (data && data.org_id) {
        console.log("✅ Found org_id in database:", data.org_id);
        setOrgId(data.org_id);
        await fetchOrgDetails(data.org_id);
        
        // Update user metadata with org_id for faster access next time
        updateUserMetadataWithOrgId(data.org_id);
      } else {
        console.warn("⚠️ User not associated with an organization");
      }
    } catch (error) {
      console.error("❌ Error fetching org from database:", error);
    }
  };
  
  // Update user metadata with org_id for faster access in future
  const updateUserMetadataWithOrgId = async (orgId: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { org_id: orgId }
      });
      
      if (error) {
        console.warn("⚠️ Could not update user metadata with org_id:", error);
      } else {
        console.log("✅ Updated user metadata with org_id");
      }
    } catch (error) {
      console.error("❌ Error updating user metadata:", error);
    }
  };

  // Function to recover org context from user metadata or database
  const recoverOrgContext = async () => {
    if (!userId || !isAuthenticated) return false;
    
    setIsRecoveringOrgContext(true);
    
    try {
      console.log("🔄 Attempting to recover org context for user:", userId);
      
      // First try direct database query
      await fetchOrgFromDatabase(userId);
      
      // Check if recovery was successful
      const wasSuccessful = !!orgId;
      
      if (wasSuccessful) {
        toast({
          title: "Organization Recovered",
          description: "Your organization context has been restored.",
        });
      }
      
      setIsRecoveringOrgContext(false);
      return wasSuccessful;
    } catch (error) {
      console.error("❌ Error recovering org context:", error);
      setIsRecoveringOrgContext(false);
      return false;
    }
  };

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
