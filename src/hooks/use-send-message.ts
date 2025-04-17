
import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { useVoiceParam } from './use-voice-param';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useVisibilityChange } from '@/contexts/auth/hooks/useVisibilityChange';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage, createLoadingMessage, createSageErrorMessage } from '@/utils/messageUtils';
import { fetchAuth } from '@/lib/backendAuth';

interface DebugPanelHandlers {
  setRequestLoading: () => void;
  setRequestSuccess: (responseTime: number) => void;
  setRequestError: (error: string) => void;
}

export const useSendMessage = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  userId: string | null,
  orgId: string | null,
  user: any | null,
  debugHandlers?: DebugPanelHandlers
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshSession } = useAuth();
  
  const sessionRefreshInProgress = useRef(false);
  const sessionRefreshSuccessful = useRef(false);
  
  useVisibilityChange({
    onVisible: () => {
      if (refreshSession && !sessionRefreshInProgress.current) {
        sessionRefreshInProgress.current = true;
        console.log('🔄 Proactively refreshing session after tab refocus');
        
        refreshSession('message UI tab refocus')
          .then(() => {
            console.log('✅ Session refresh successful after tab refocus');
            sessionRefreshSuccessful.current = true;
            sessionRefreshInProgress.current = false;
          })
          .catch(err => {
            console.error('❌ Session refresh failed after tab refocus:', err);
            sessionRefreshInProgress.current = false;
            
            toast({
              variant: "destructive",
              title: "Session refresh failed",
              description: "You may need to sign in again to continue chatting."
            });
          });
      }
    }
  });
  
  const handleSendMessage = useCallback(async (content: string) => {
    if (!user || !userId || !orgId || sessionRefreshInProgress.current) {
      toast({
        variant: "destructive",
        title: "Sage isn't quite ready yet",
        description: "Please wait a moment and try again.",
      });
      return;
    }

    const userMessage = createUserMessage(content);
    setMessages(prev => [...prev, userMessage]);

    const loadingMessage = createLoadingMessage("Thinking...");
    setMessages(prev => [...prev, loadingMessage]);

    setIsLoading(true);
    if (debugHandlers) debugHandlers.setRequestLoading();

    const startTime = Date.now();

    try {
      const sessionData = await fetchAuth();
      const token = sessionData.session.id;

      if (!token) {
        throw new Error("No access token found. User might not be authenticated.");
      }

      // Log context at time of sending message
      console.log("[Sage Message] Sending with context:", {
        userId,
        orgId,
        hasUser: !!user,
        timestamp: new Date().toISOString()
      });

      const response = await fetch("https://sagebright-backend-production.up.railway.app/api/ask-sage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to get response from Sage: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("🧨 Failed to parse Sage response as JSON:", parseError);
        console.log("Raw response:", await response.clone().text());
        throw new Error("Invalid response format from Sage server");
      }

      const sageMessage = createSageMessage(data.reply);
      setMessages(prev =>
        prev.filter(m => !m.isLoading).concat(sageMessage)
      );

      const responseTime = Date.now() - startTime;
      if (debugHandlers) debugHandlers.setRequestSuccess(responseTime);

      console.log(`✅ Sage replied in ${responseTime}ms`);
    } catch (error) {
      console.error("❌ Sage backend error:", error);
      setMessages(prev =>
        prev.filter(m => !m.isLoading).concat(
          createSageErrorMessage("Something went wrong. Please try again.")
        )
      );

      toast({
        variant: "destructive",
        title: "Sage error",
        description: error instanceof Error ? error.message : String(error),
      });

      if (debugHandlers) {
        debugHandlers.setRequestError(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, orgId, user, setMessages, debugHandlers]);

  return {
    isLoading,
    handleSendMessage,
  };
};
