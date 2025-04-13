
import { useState } from 'react';
import { Message, SageContext } from '@/types/chat';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage } from '@/utils/messageUtils';
import { handleMissingOrgContext, handleMissingUserContext, handleChatError } from '@/utils/sageErrorUtils';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { voiceprints } from '@/lib/voiceprints';
import { handleApiError } from '@/lib/handleApiError';

/**
 * Hook for handling the message sending functionality
 */
export function useSendMessage(
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  userId: string | null,
  orgId: string | null,
  currentUser: any | null
) {
  const [isLoading, setIsLoading] = useState(false);
  // Use our custom hook to get the voice parameter
  const voice = useVoiceParam();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      console.log("Empty message content, not sending");
      return;
    }

    // Log detailed user state before sending message with improved formatting
    console.group("👤 Send Message Context");
    console.log("User state:", {
      userId,
      orgId,
      hasUser: !!currentUser,
      hasUserMetadata: currentUser ? !!currentUser.user_metadata : false,
      voice
    });
    console.groupEnd();

    if (!userId) {
      handleApiError(new Error("Missing userId"), {
        context: "authentication",
        fallbackMessage: "You need to be logged in to use Sage. Please sign in and try again."
      });
      return;
    }

    if (!orgId) {
      handleApiError(new Error("Missing orgId"), {
        context: "organization",
        fallbackMessage: "Your account is not linked to an organization. Try signing out and back in, or contact support."
      });
      return;
    }
    
    console.log("✅ Sending message with context:", { 
      content, 
      userId, 
      orgId,
      voiceParam: voice 
    });

    const userMessage = createUserMessage(content, currentUser?.avatar_url);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log(`🔍 Building context for userId: ${userId}, orgId: ${orgId}, voice: ${voice}`);
      const context = await buildSageContext(userId, orgId);
      
      // Log the context building result with improved visibility
      console.group("🧩 Context Building Result");
      console.log("Context complete:", !!context.org && !!context.user);
      console.log("Org context:", context.org ? "✅ Present" : "❌ Missing");
      console.log("User context:", context.user ? "✅ Present" : "❌ Missing");
      console.groupEnd();
      
      // Check if context.org exists before accessing its properties
      if (!context.org) {
        handleMissingOrgContext(setMessages, setIsLoading);
        return;
      }
      
      // Check if context.org.name exists
      if (!context.org.name) {
        handleMissingOrgContext(setMessages, setIsLoading);
        return;
      }
      
      // Check if context.user exists before accessing its properties
      if (!context.user) {
        handleMissingUserContext(setMessages, setIsLoading);
        return;
      }
      
      // Check if context.user.role exists
      if (!context.user.role) {
        handleMissingUserContext(setMessages, setIsLoading);
        return;
      }
      
      console.log("🎤 Using voice from hook:", voice);
      
      // Validate voice parameter against available voices
      const isValidVoice = voice in voiceprints;
      console.log("🔊 Voice validation check:", { voice, isValid: isValidVoice });
      
      // Use the validated voice or fall back to 'default'
      const finalVoice = isValidVoice ? voice : 'default';
      if (!isValidVoice && voice !== 'default') {
        console.warn(`⚠️ Invalid voice "${voice}" requested, falling back to default`);
      }
      
      // Log the final voice being sent to OpenAI
      console.log(`🎙️ Sending final voice to OpenAI: "${finalVoice}"`);
      
      const answer = await callOpenAI({ 
        question: content, 
        context, 
        voice: finalVoice 
      });
      console.log("Received answer from OpenAI");

      const sageMessage = createSageMessage(answer);
      setMessages(prev => [...prev, sageMessage]);
    } catch (err) {
      handleChatError(err, setMessages, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSendMessage
  };
}
