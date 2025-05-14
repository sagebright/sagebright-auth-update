
import { useState } from 'react';
import { Message } from '@/types/chat';

/**
 * Hook for managing message feedback (likes/dislikes)
 */
export function useFeedback(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike' | 'positive' | 'negative') => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        // Handle both naming conventions
        const isPositive = feedback === 'like' || feedback === 'positive';
        const isNegative = feedback === 'dislike' || feedback === 'negative';
        
        return {
          ...message,
          liked: isPositive,
          disliked: isNegative,
        };
      }
      return message;
    }));
  };

  return {
    messages,
    setMessages,
    handleFeedback,
  };
}
