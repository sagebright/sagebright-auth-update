
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useOrgRecovery = (
  userId: string | null, 
  orgId: string | null, 
  isAuthenticated: boolean
) => {
  const [isRecoveringOrg, setIsRecoveringOrg] = useState(false);
  const [hasRecoveredOrgId, setHasRecoveredOrgId] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userId && !orgId && !isRecoveringOrg && !hasRecoveredOrgId) {
      const fetchOrgData = async () => {
        setIsRecoveringOrg(true);
        try {
          console.log("🔍 Trying to fetch missing org ID from users table");
          
          const { data: sessionData } = await supabase.auth.getSession();
          const metadataOrgId = sessionData?.session?.user?.user_metadata?.org_id;
          
          if (metadataOrgId) {
            console.log("✅ Found org ID in user metadata:", metadataOrgId);
            setIsRecoveringOrg(false);
            setHasRecoveredOrgId(true);
            return;
          }
          
          const { data, error } = await supabase
            .from('users')
            .select('org_id')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.warn("⚠️ Error fetching user org data:", error);
            setIsRecoveringOrg(false);
            setHasRecoveredOrgId(true);
            return;
          }
          
          if (data?.org_id) {
            console.log("✅ Found org ID in database:", data.org_id);
            
            await supabase.auth.updateUser({
              data: { org_id: data.org_id }
            });
            
            await supabase.auth.refreshSession();
            console.log("✅ Updated user metadata with org_id and refreshed session");
          } else {
            console.warn("⚠️ No org ID found for user");
          }
        } catch (err) {
          console.error("❌ Error recovering org data:", err);
        } finally {
          setIsRecoveringOrg(false);
          setHasRecoveredOrgId(true);
        }
      };
      
      fetchOrgData();
    }
  }, [userId, orgId, isAuthenticated, isRecoveringOrg, hasRecoveredOrgId]);

  return {
    isRecoveringOrg,
    hasRecoveredOrgId
  };
};
