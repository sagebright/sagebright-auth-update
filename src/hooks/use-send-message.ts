
import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from './use-voice-param';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage, createLoadingMessage, createSageErrorMessage } from '@/utils/messageUtils';

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
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "User or organization information is missing. Please try again later."
      });
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
  }, [userId, orgId, voice, setMessages, debugHandlers]);

  return {
    isLoading,
    handleSendMessage,
  };
};
