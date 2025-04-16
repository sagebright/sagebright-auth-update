import { useState, useCallback } from 'react';
import { DebugPanelState } from '@/hooks/use-debug-panel';
import { v4 as uuidv4 } from 'uuid';

export const useChat = (debugPanel: DebugPanelState, isOrgReady: boolean = false) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [isRecoveringOrg, setIsRecoveringOrg] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!isOrgReady) {
      console.warn("[Sage Chat] ⚠️ Cannot send message - waiting for org context");
      return;
    }

    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), content: content, role: 'user' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content, debugPanel }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.output) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), content: data.output, role: 'sage' },
        ]);
        setSuggestedQuestions(data.suggestedQuestions || []);
        setShowReflection(data.showReflection);
      } else {
        console.warn("Empty response from /api/chat");
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), content: "Sorry, I encountered an error. Please try again.", role: 'sage' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isOrgReady, debugPanel]);

  const handleFeedback = async (messageId: string, feedback: string) => {
    console.log('Feedback submitted:', { messageId, feedback });
    // Here you would typically send the feedback to your server
    // for storage and/or analysis.
  };

  return {
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  };
};
