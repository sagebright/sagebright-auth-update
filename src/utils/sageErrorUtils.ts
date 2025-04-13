
import { toast } from '@/components/ui/use-toast';
import { createSageErrorMessage } from './messageUtils';
import { Message } from '@/types/chat';

/**
 * Handles missing organization context
 */
export function handleMissingOrgContext(setMessages: React.Dispatch<React.SetStateAction<Message[]>>, setIsLoading: (isLoading: boolean) => void) {
  setIsLoading(false);
  
  toast({
    variant: "destructive",
    title: "Incomplete Organization Data",
    description: "Unable to personalize Sage's responses. Please contact support to complete your organization profile."
  });
  
  const errorMessage = createSageErrorMessage(
    "I'm sorry, but I don't have enough information about your organization to properly assist you. Please contact support to complete your organization profile."
  );
  
  setMessages(prev => [...prev, errorMessage]);
}

/**
 * Handles missing user context
 */
export function handleMissingUserContext(setMessages: React.Dispatch<React.SetStateAction<Message[]>>, setIsLoading: (isLoading: boolean) => void) {
  setIsLoading(false);
  
  toast({
    variant: "destructive",
    title: "Incomplete User Profile",
    description: "Unable to personalize Sage's responses. Please complete your user profile."
  });
  
  const errorMessage = createSageErrorMessage(
    "I'm sorry, but I don't have enough information about your profile to properly assist you. Please complete your user profile."
  );
  
  setMessages(prev => [...prev, errorMessage]);
}

/**
 * Handles general chat errors
 */
export function handleChatError(error: unknown, setMessages: React.Dispatch<React.SetStateAction<Message[]>>, setIsLoading: (isLoading: boolean) => void) {
  console.error("Error in chat:", error);
  
  setIsLoading(false);
  
  const errorMessage = createSageErrorMessage();
  
  setMessages(prev => [...prev, errorMessage]);
  
  toast({
    variant: "destructive",
    title: "Error",
    description: "Failed to get a response. Please try again."
  });
}

