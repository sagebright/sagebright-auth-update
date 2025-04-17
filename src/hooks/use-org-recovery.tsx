
import { useState, useEffect } from 'react';
import { fetchAuth } from '@/lib/backendAuth';

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
          console.log("🔍 Trying to fetch missing org ID from backend auth");
          
          // Fetch auth data from backend endpoint
          const authData = await fetchAuth();
          
          if (authData?.org?.id) {
            console.log("✅ Found org ID in backend auth:", authData.org.id);
            setIsRecoveringOrg(false);
            setHasRecoveredOrgId(true);
            return;
          }
          
          console.warn("⚠️ No org ID found for user in backend auth");
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
