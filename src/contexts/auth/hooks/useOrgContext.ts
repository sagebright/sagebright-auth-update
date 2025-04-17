import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrgById } from '@/lib/subdomainUtils';
import { supabase } from '@/lib/supabaseClient';

// A more resilient version of useOrgContext that prioritizes user metadata
export function useOrgContext(userId: string | null, isAuthenticated: boolean) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const fetchInProgressRef = useRef(false);
  const { toast } = useToast();
  
  // First try to get org context from user metadata when userId is available
  useEffect(() => {
    if (!userId || !isAuthenticated || fetchInProgressRef.current) return;
    
    const getOrgFromUserMetadata = async () => {
      if (fetchInProgressRef.current) return;
      fetchInProgressRef.current = true;
      
      try {
        // Get user data from auth
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.warn('⚠️ Unable to get user data for org context:', error);
          fetchInProgressRef.current = false;
          return;
        }
        
        // Check if user metadata contains org_id
        const metadata = data.user.user_metadata || {};
        const orgIdFromMetadata = metadata.org_id;
        const orgSlugFromMetadata = metadata.org_slug;
        
        console.log("🔍 Checking user metadata for org details:", { 
          orgIdFromMetadata, 
          orgSlugFromMetadata,
          fullMetadata: metadata
        });
        
        if (orgIdFromMetadata) {
          console.log("🏢 Found org_id in user metadata:", orgIdFromMetadata);
          setOrgId(orgIdFromMetadata);
          
          // If metadata also has org_slug, use it directly
          if (orgSlugFromMetadata) {
            console.log("🏢 Found org_slug in user metadata:", orgSlugFromMetadata);
            setOrgSlug(orgSlugFromMetadata);
          } else {
            // Otherwise fetch org details to get slug
            await fetchOrgDetails(orgIdFromMetadata);
          }
        } else {
          console.log("⚠️ No org_id found in user metadata, will try database");
          // If not in metadata, try to get from database
          await fetchOrgFromDatabase(userId);
        }
        
        fetchInProgressRef.current = false;
      } catch (err) {
        console.error("❌ Error getting org context from metadata:", err);
        fetchInProgressRef.current = false;
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
        console.log("🏢 Set orgSlug from API in useOrgContext:", org.slug);
      } else {
        console.warn("⚠️ No slug found for org ID:", orgId);
        
        // Try to find the slug using a direct query as backup
        const { data: orgData, error } = await supabase
          .from('orgs')
          .select('slug')
          .eq('id', orgId)
          .single();
          
        if (!error && orgData && orgData.slug) {
          setOrgSlug(orgData.slug);
          console.log("🏢 Set orgSlug via direct query:", orgData.slug);
        } else {
          // Last resort: Set a fallback slug to prevent blocking
          console.log("⚠️ Using fallback slug for development context");
          setOrgSlug("default-org");
          
          // Update user metadata with the fallback slug for faster access next time
          try {
            await supabase.auth.updateUser({
              data: { org_slug: "default-org" }
            });
            console.log("✅ Updated user metadata with fallback org_slug");
          } catch (updateError) {
            console.warn("⚠️ Could not update user metadata with fallback slug:", updateError);
          }
        }
      }
      
      console.log("[useOrgContext] Final orgSlug:", orgSlug);
    } catch (error) {
      console.error("❌ Error fetching org details:", error);
      
      // Set fallback slug on error to prevent blocking
      setOrgSlug("default-org");
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
        // Set development fallback values
        setOrgId("default-org-id");
        setOrgSlug("default-org");
        return;
      }
      
      if (data && data.org_id) {
        console.log("✅ Found org_id in database:", data.org_id);
        setOrgId(data.org_id);
        await fetchOrgDetails(data.org_id);
        
        // Update user metadata with org_id for faster access next time
        updateUserMetadataWithOrgId(data.org_id);
      } else {
        console.warn("⚠️ User not associated with an organization, using fallback");
        // Set development fallback values
        setOrgId("default-org-id");
        setOrgSlug("default-org");
      }
    } catch (error) {
      console.error("❌ Error fetching org from database:", error);
      // Set fallback values on error
      setOrgId("default-org-id");
      setOrgSlug("default-org");
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
