
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/handleApiError';

/**
 * Hook for handling organization context recovery
 */
export function useOrgRecovery(authState: any, fetchAuthState: any) {
  const [isRecoveringOrgContext, setIsRecoveringOrgContext] = useState(false);
  
  // Recover org context if needed
  const recoverOrgContext = useCallback(async () => {
    if (!authState.userId || !authState.isAuthenticated) return false;
    
    setIsRecoveringOrgContext(true);
    try {
      console.log("🔄 Attempting to recover org context");
      await fetchAuthState({ force: true });
      const success = !!authState.orgId;
      setIsRecoveringOrgContext(false);
      
      if (success) {
        toast({
          title: "Organization context recovered",
          description: "Your organization context has been restored successfully."
        });
      }
      
      return success;
    } catch (error) {
      handleApiError(error, {
        context: 'org-context-recovery',
        showToast: true,
        fallbackMessage: 'Unable to recover organization context. Please try signing out and back in.'
      });
      
      setIsRecoveringOrgContext(false);
      return false;
    }
  }, [authState.userId, authState.isAuthenticated, authState.orgId, fetchAuthState]);

  return {
    isRecoveringOrgContext,
    recoverOrgContext
  };
}
