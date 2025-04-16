
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { SageContextReadiness } from '@/hooks/use-sage-context-readiness';

export const useSageMessenger = (
  userId: string | null,
  orgId: string | null,
  handleSendMessage: (content: string) => Promise<void>,
  user: any,
  contextReadiness: SageContextReadiness
) => {
  const sendMessageToSage = useCallback(async (content: string) => {
    if (!contextReadiness.isContextReady) {
      console.error("❌ Cannot send message - context not ready:", {
        blockers: contextReadiness.blockers,
        isReadyToRender: contextReadiness.isReadyToRender,
        isSessionReady: contextReadiness.isSessionReady,
        isOrgReady: contextReadiness.isOrgReady,
        isVoiceReady: contextReadiness.isVoiceReady,
        isSessionStable: contextReadiness.isSessionStable
      });
      
      const blockerMessage = contextReadiness.blockers.length > 0 
        ? contextReadiness.blockers.join(', ') 
        : "Unknown issue with session data";
      
      toast({
        variant: "destructive",
        title: "Sage isn't quite ready",
        description: `Please wait a moment: ${blockerMessage}`,
      });
      return;
    }

    if (!contextReadiness.isSessionStable) {
      console.warn("⚠️ Session not fully stable, proceeding with caution:", {
        isContextReady: contextReadiness.isContextReady,
        isSessionStable: contextReadiness.isSessionStable,
        userId,
        orgId,
        hasSessionUser: !!user,
        hasUserMetadata: user ? !!user.user_metadata : false
      });
    }

    console.log("🚀 Sending message with context:", {
      userId,
      orgId,
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false,
      isContextReady: contextReadiness.isContextReady,
      isSessionStable: contextReadiness.isSessionStable,
      readySince: contextReadiness.readySince ? new Date(contextReadiness.readySince).toISOString() : null
    });

    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [
    userId, 
    orgId, 
    handleSendMessage, 
    user, 
    contextReadiness
  ]);

  return { sendMessageToSage };
};
