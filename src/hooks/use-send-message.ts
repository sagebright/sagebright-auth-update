
import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from './use-voice-param';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage, createLoadingMessage, createSageErrorMessage } from '@/utils/messageUtils';
import { useAuth } from '@/contexts/auth/AuthContext';

interface DebugPanelHandlers {
  setRequestLoading: () => void;
  setRequestSuccess: (responseTime: number) => void;
  setRequestError: (error: string) => void;
}

/**
 * Custom hook for sending messages to Sage
 */
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
    if (debugHandlers) {
      debugHandlers.setRequestLoading();
    }

    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    // Validate voice parameter against available voices
    const isValidVoice = voice in voiceprints;
    
    console.group(`🔍 Voice Parameter Resolution (${timestamp})`);
    console.log("Initial voice param:", voice);
    console.log("Is valid voice:", isValidVoice);
    
    if (!isValidVoice && voice !== 'default') {
      console.warn(`⚠️ Invalid voice "${voice}" requested, falling back to default`);
      console.log("Available voices:", Object.keys(voiceprints));
    }
    
    // Use the validated voice or fall back to 'default'
    const finalVoice = isValidVoice ? voice : 'default';
    
    console.log("Final voice used:", finalVoice);
    console.groupEnd();
    
    if (!isValidVoice && voice !== 'default') {
      console.warn(`🚨 Mismatch detected: "${voice}" not in available voices. Using "${finalVoice}"`);
    }

    try {
      // Create a new user message
      const userMessage = createUserMessage(content);

      // Update messages state with the new user message
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Build the context for Sage
      const context = await buildSageContext(userId, orgId);
      
      // Prepare loading message for better UX
      const loadingMessage = createLoadingMessage("Thinking...");
      
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);
      
      // Call the OpenAI API with the built context
      const responseContent = await callOpenAI({
        question: content,
        context,
        voice: finalVoice
      });
      
      // Replace loading message with the actual response
      const sageMessage = createSageMessage(responseContent);

      setMessages((prevMessages) => 
        prevMessages.filter(msg => !msg.isLoading).concat(sageMessage)
      );
      
      const responseTime = Date.now() - startTime;
      if (debugHandlers) {
        debugHandlers.setRequestSuccess(responseTime);
      }
      
      console.log(`🎤 Message sent with voice: ${finalVoice} (response time: ${responseTime}ms)`);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove loading message and add error message
      setMessages((prevMessages) => 
        prevMessages.filter(msg => !msg.isLoading).concat(
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
