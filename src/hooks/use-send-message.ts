
import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from './use-voice-param';
import { buildSageContext } from '@/lib/buildSageContext';
import { sendToOpenAI } from '@/lib/backendApi'; 
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
  const voice = useVoiceParam();
  
  // Track tab visibility to handle refocus issues
  const wasHiddenRef = useRef(false);
  const lastVisibilityChangeTime = useRef(Date.now());
  const sessionRefreshInProgress = useRef(false);
  const sessionRefreshSuccessful = useRef(false);
  
  // Detect tab visibility changes with more robust handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      const currentTime = Date.now();
      
      if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true;
        lastVisibilityChangeTime.current = currentTime;
        sessionRefreshSuccessful.current = false;
        console.log('📱 Tab/window hidden at:', new Date(currentTime).toISOString());
      } else if (wasHiddenRef.current) {
        // Page has become visible after being hidden
        const timeHidden = currentTime - lastVisibilityChangeTime.current;
        wasHiddenRef.current = false;
        
        console.log(`📱 Tab/window visible again after ${timeHidden}ms at:`, new Date(currentTime).toISOString());
        
        // Force session refresh on tab refocus - this is critical to prevent stalled chat
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
              
              // Show toast for session issues
              toast({
                variant: "destructive",
                title: "Session refresh failed",
                description: "You may need to sign in again to continue chatting."
              });
            });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle window focus events as a backup
    const handleWindowFocus = () => {
      if (!sessionRefreshSuccessful.current && !sessionRefreshInProgress.current && refreshSession) {
        sessionRefreshInProgress.current = true;
        console.log('🔄 Refreshing session on window focus');
        
        refreshSession('window focus')
          .then(() => {
            sessionRefreshSuccessful.current = true;
            sessionRefreshInProgress.current = false;
          })
          .catch(() => {
            sessionRefreshInProgress.current = false;
          });
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
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

    // ALWAYS refresh session before sending - critical for reliability after tab changes
    let sessionRefreshed = false;
    if (refreshSession) {
      try {
        console.log('🔄 Pre-message session refresh - ALWAYS refreshing before sending');
        
        // Clear all previous status flags
        sessionRefreshSuccessful.current = false;
        sessionRefreshInProgress.current = true;
        
        await refreshSession('pre-message send');
        sessionRefreshed = true;
        sessionRefreshSuccessful.current = true;
        console.log('✅ Pre-message session refresh successful');
      } catch (refreshError) {
        console.error('❌ Failed to refresh session before sending message:', refreshError);
        
        // Show user-facing error for auth issues
        toast({
          variant: "destructive",
          title: "Session error",
          description: "There was an issue with your session. Try refreshing the page."
        });
        
        // Gracefully abort the message send
        return;
      } finally {
        sessionRefreshInProgress.current = false;
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
    console.log("Session was refreshed before sending:", sessionRefreshed);
    console.groupEnd();

    try {
      const userMessage = createUserMessage(content);
      setMessages(prev => [...prev, userMessage]);

      const context = await buildSageContext(userId, orgId);
      const loadingMessage = createLoadingMessage("Thinking...");
      setMessages(prev => [...prev, loadingMessage]);

      const systemPrompt = getCompleteSystemPrompt(context, finalVoice);

      console.log(`🚀 Sending message to OpenAI at ${new Date().toISOString()}`);
      
      const data = await sendToOpenAI({
        systemPrompt,
        userPrompt: content,
        voice: finalVoice
      });

      console.log(`✅ Received response from OpenAI at ${new Date().toISOString()}`);

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
