
import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from './use-voice-param';
import { buildSageContext } from '@/lib/buildSageContext';
import { sendToOpenAI } from '@/lib/backendApi'; // 🔄 new function
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage, createLoadingMessage, createSageErrorMessage } from '@/utils/messageUtils';
import { useAuth } from '@/contexts/auth/AuthContext';

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
  // Get the voice parameter from our custom hook
  const voice = useVoiceParam();
  
  // Track tab visibility to handle refocus issues
  const wasHiddenRef = useRef(false);
  
  // Detect tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        // Page has become visible after being hidden
        wasHiddenRef.current = false;
        
        // Refresh session if we have the refresh function
        if (refreshSession) {
          console.log('📱 Message interface detected tab refocus, refreshing session');
          refreshSession('message UI tab refocus');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshSession]);
  
  // Function to handle sending message to Sage
  const handleSendMessage = useCallback(async (content: string) => {
    if (!userId || !orgId) {
      console.error("Cannot send message without userId and orgId");
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "User or organization information is missing. Please try again later."
      });
      return;
    }

    // Check if we need to refresh the session before sending (tab was hidden)
    if (wasHiddenRef.current && refreshSession) {
      console.log('🔄 Pre-message session refresh due to tab visibility change');
      try {
        await refreshSession('pre-message tab change');
        wasHiddenRef.current = false;
      } catch (refreshError) {
        console.error('Failed to refresh session before sending message:', refreshError);
      }
    }

    setIsLoading(true);
    if (debugHandlers) debugHandlers.setRequestLoading();

    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    const isValidVoice = voice in voiceprints;
    const finalVoice = isValidVoice ? voice : 'default';

    console.group(`🔍 Voice Parameter Resolution (${timestamp})`);
    console.log("Initial voice param:", voice);
    console.log("Is valid voice:", isValidVoice);
    console.log("Final voice used:", finalVoice);
    console.groupEnd();

    try {
      const userMessage = createUserMessage(content);
      setMessages(prev => [...prev, userMessage]);

      const context = await buildSageContext(userId, orgId);
      const loadingMessage = createLoadingMessage("Thinking...");
      setMessages(prev => [...prev, loadingMessage]);

      const systemPrompt = getCompleteSystemPrompt(context, finalVoice); // 🧠 still using client scaffolding

      const data = await sendToOpenAI({
        systemPrompt,
        userPrompt: content,
        voice: finalVoice
      });

      const responseContent = data?.choices?.[0]?.message?.content || 'No response content found.';
      const sageMessage = createSageMessage(responseContent);
      setMessages(prev => prev.filter(m => !m.isLoading).concat(sageMessage));

      const responseTime = Date.now() - startTime;
      if (debugHandlers) debugHandlers.setRequestSuccess(responseTime);

      console.log(`🎤 Message sent with voice: ${finalVoice} (response time: ${responseTime}ms)`);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev =>
        prev.filter(m => !m.isLoading).concat(
          createSageErrorMessage("I'm sorry, I encountered an error processing your request. Please try again.")
        )
      );
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      if (debugHandlers) {
        debugHandlers.setRequestError(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, orgId, voice, setMessages, debugHandlers, refreshSession]);

  return {
    isLoading,
    handleSendMessage,
  };
};
