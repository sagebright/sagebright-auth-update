
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrgById } from '@/lib/subdomainUtils';

// A more resilient version of useOrgContext that doesn't depend on backend API
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

  // Function to recover org context from user metadata or other sources
  const recoverOrgContext = async () => {
    if (!userId || !isAuthenticated) return;
    
    setIsRecoveringOrgContext(true);
    
    try {
      console.log("🔄 Attempting to recover org context for user:", userId);
      
      // Logic to recover org context could be implemented here
      // For now, just set a timeout to clear the recovery state
      
      setTimeout(() => {
        setIsRecoveringOrgContext(false);
      }, 1000);
      
      return true;
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
