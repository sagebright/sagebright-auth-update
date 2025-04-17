
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
 * Handles context timeout scenario
 */
export function handleContextTimeout(setMessages: React.Dispatch<React.SetStateAction<Message[]>>, setIsLoading: (isLoading: boolean) => void) {
  setIsLoading(false);
  
  toast({
    variant: "warning",
    title: "Limited Personalization",
    description: "Some personalized features may be unavailable. You can continue with basic functionality."
  });
  
  const timeoutMessage = createSageErrorMessage(
    "I'm ready to help, though I may have limited information about your specific context right now. Feel free to ask questions, and I'll do my best to assist with what I know."
  );
  
  setMessages(prev => [...prev, timeoutMessage]);
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
