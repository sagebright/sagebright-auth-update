
import { useEffect, useState } from 'react';

/**
 * Provides a single authoritative check for Sage context readiness.
 * This ensures all required context is available before allowing rendering or message sending.
 */
export function useSageContextReady(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean
) {
  const [isContextReady, setIsContextReady] = useState(false);
  const [contextCheckComplete, setContextCheckComplete] = useState(false);

  useEffect(() => {
    // Only run once auth loading is complete
    if (authLoading) return;

    // Log current context state
    console.log("[SageContext] Context readiness check:", {
      hasUserId: !!userId,
      hasOrgId: !!orgId,
      hasOrgSlug: !!orgSlug,
      hasCurrentUserData: !!currentUserData,
      isSessionUserReady,
      timestamp: new Date().toISOString()
    });

    // Check all required context
    const hasFullContext = !!(
      userId && 
      orgId && 
      orgSlug && 
      currentUserData && 
      isSessionUserReady
    );

    setIsContextReady(hasFullContext);
    setContextCheckComplete(true);

    if (!hasFullContext) {
      console.warn("[SageContext] ⚠️ Incomplete context for Sage:", {
        missingUserId: !userId,
        missingOrgId: !orgId,
        missingOrgSlug: !orgSlug,
        missingCurrentUserData: !currentUserData,
        missingSessionUser: !isSessionUserReady
      });
    } else {
      console.log("[SageContext] ✅ Full context for Sage is available");
    }
  }, [userId, orgId, orgSlug, currentUserData, authLoading, isSessionUserReady]);

  return {
    isContextReady,
    contextCheckComplete,
    missingContext: contextCheckComplete && !isContextReady
  };
}
