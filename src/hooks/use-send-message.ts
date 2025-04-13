
import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from './use-voice-param';

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
  user: any | null, // Changed from User to any to fix the first error
  debugHandlers?: DebugPanelHandlers
) => {
  const [isLoading, setIsLoading] = useState(false);
  // Get the voice parameter from our custom hook
  const voice = useVoiceParam();
  
  // Function to handle sending message to Sage
  const handleSendMessage = useCallback(async (content: string) => {
    if (!userId || !orgId) {
      console.error("Cannot send message without userId and orgId");
      return;
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
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date(), // Fixed by using Date object instead of string
      };

      // Update messages state with the new user message
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // TODO: Replace this with actual API call to the backend
      // For now, we're just simulating a response
      setTimeout(() => {
        const sageMessage: Message = {
          id: `sage-${Date.now()}`,
          content: `This is a simulated response from Sage using voice: ${finalVoice}. You asked: "${content}"`,
          role: 'assistant',
          timestamp: new Date(), // Fixed by using Date object instead of string
        };

        setMessages((prevMessages) => [...prevMessages, sageMessage]);
        setIsLoading(false);
        
        const responseTime = Date.now() - startTime;
        if (debugHandlers) {
          debugHandlers.setRequestSuccess(responseTime);
        }
        
        console.log(`🎤 Message sent with voice: ${finalVoice} (response time: ${responseTime}ms)`);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      if (debugHandlers) {
        debugHandlers.setRequestError(error instanceof Error ? error.message : String(error));
      }
    }
  }, [userId, orgId, voice, setMessages, debugHandlers]);

  return {
    isLoading,
    handleSendMessage,
  };
};
