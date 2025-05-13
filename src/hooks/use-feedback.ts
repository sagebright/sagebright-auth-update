
import { useState } from 'react';
import { Message } from '@/types/chat';

/**
 * Hook for managing message feedback (likes/dislikes)
 */
export function useFeedback(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          liked: feedback === 'like' ? true : false,
          disliked: feedback === 'dislike' ? true : false,
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
