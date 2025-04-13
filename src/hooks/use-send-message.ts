
import { useState } from 'react';
import { Message, SageContext } from '@/types/chat';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { createUserMessage, createSageMessage } from '@/utils/messageUtils';
import { handleMissingOrgContext, handleMissingUserContext, handleChatError } from '@/utils/sageErrorUtils';
import { getVoiceFromUrl } from '@/lib/utils';
import { voiceprints } from '@/lib/voiceprints';

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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      console.log("Empty message content, not sending");
      return;
    }

    if (!userId) {
      console.error("❌ Missing userId, user might not be authenticated", { userId });
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You need to be logged in to use Sage. Please sign in and try again."
      });
      return;
    }

    if (!orgId) {
      console.error("❌ Missing orgId. User might not be linked to an organization", { userId, orgId });
      toast({
        variant: "destructive",
        title: "Organization Error",
        description: "Your account is not linked to an organization. Try signing out and back in, or contact support."
      });
      return;
    }
    
    console.log("✅ Sending message with context:", { content, userId, orgId });

    const userMessage = createUserMessage(content, currentUser?.avatar_url);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log("Building context for userId:", userId, "orgId:", orgId);
      const context = await buildSageContext(userId, orgId);
      console.log("Context built:", context);
      
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
      
      // Get voice parameter from URL
      const voice = getVoiceFromUrl();
      
      // Validate voice parameter against available voices
      const isValidVoice = voice in voiceprints;
      console.log("🔊 Parsed voice param:", voice, "Valid:", isValidVoice);
      
      // Use the validated voice or fall back to 'default'
      const finalVoice = isValidVoice ? voice : 'default';
      if (!isValidVoice && voice !== 'default') {
        console.warn(`⚠️ Invalid voice "${voice}" requested, falling back to default`);
      }
      
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
