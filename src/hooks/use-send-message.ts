import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { useVoiceParam } from './use-voice-param';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useVisibilityChange } from '@/contexts/auth/hooks/useVisibilityChange';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage, createLoadingMessage, createSageErrorMessage } from '@/utils/messageUtils';
import { supabase } from '@/lib/supabaseClient';

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
    if (!userId || !orgId) {
      console.error("Missing userId or orgId");
      toast({
        variant: "destructive",
        title: "Missing context",
        description: "Please sign in again or reload the app.",
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("No access token found. User might not be authenticated.");
      }

      const response = await fetch("https://sagebright-backend-production.up.railway.app/api/ask-sage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown error from Sage");
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
  }, [userId, orgId, setMessages, debugHandlers]);

  return {
    isLoading,
    handleSendMessage,
  };
};
