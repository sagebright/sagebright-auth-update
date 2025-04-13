
import { Message } from '@/types/chat';

/**
 * Creates a user message object
 */
export function createUserMessage(content: string, avatarUrl?: string): Message {
  return {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date(),
    avatar_url: avatarUrl,
  };
}

/**
 * Creates a Sage (AI) message object
 */
export function createSageMessage(content: string, options?: { isLoading?: boolean; isError?: boolean }): Message {
  return {
    id: (Date.now() + 1).toString(),
    content,
    sender: 'sage',
    timestamp: new Date(),
    avatar_url: "/lovable-uploads/sage_avatar.png",
    ...(options && { ...options })
  };
}

/**
 * Creates a loading message from Sage
 */
export function createLoadingMessage(content: string = "Thinking..."): Message {
  return createSageMessage(content, { isLoading: true });
}

/**
 * Creates an error message from Sage
 */
export function createSageErrorMessage(content: string = "I'm sorry, I couldn't process your request. Please try again."): Message {
  return createSageMessage(content, { isError: true });
}
