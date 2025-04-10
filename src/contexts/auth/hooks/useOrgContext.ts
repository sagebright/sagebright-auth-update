
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrgById } from '@/lib/subdomainUtils';
import { syncUserRole } from '@/lib/syncUserRole';

export function useOrgContext(userId: string | null, isAuthenticated: boolean) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  const { toast } = useToast();
  
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

  // Function to attempt recovery of org context for a user
  const recoverOrgContext = async (userId: string) => {
    if (isRecoveringOrgContext) return;
    
    setIsRecoveringOrgContext(true);
    console.log("👤 User found but no org assigned. Attempting to sync role...");
    
    try {
      await syncUserRole(userId);
      console.log("✅ Role sync attempted for user without org_id");
      
      // Success notification
      toast({
        title: "Recovery Attempted",
        description: "Please reload the page to see if recovery was successful."
      });
    } catch (syncError) {
      console.error("❌ Error syncing role:", syncError);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: "Unable to recover organization context. Please contact support."
      });
    } finally {
      setIsRecoveringOrgContext(false);
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
