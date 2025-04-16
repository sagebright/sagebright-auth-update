
import { useState, useCallback } from 'react';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { v4 as uuidv4 } from 'uuid';

// Define the type expected for debug panel
type DebugPanelState = ReturnType<typeof useDebugPanel>;

export const useChat = (debugPanel: DebugPanelState, isOrgReady: boolean = false) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What resources are available for onboarding?",
    "Who should I meet on my team?",
    "What's the best way to get started?",
    "How does the development environment work?",
  ]);
  const [showReflection, setShowReflection] = useState(false);
  const [isRecoveringOrg, setIsRecoveringOrg] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!isOrgReady) {
      console.warn("[Sage Chat] ⚠️ Cannot send message - waiting for org context");
      return;
    }

    console.log("[Sage Message] Sending with context:", {
      isOrgReady,
      timestamp: new Date().toISOString()
    });

    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), content: content, role: 'user', timestamp: new Date() },
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
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("🧨 Failed to parse Sage response as JSON", parseError);
        throw new Error("Sage server error. Check logs for HTML response.");
      }

      if (data && data.output) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), content: data.output, role: 'sage', timestamp: new Date() },
        ]);
        if (data.suggestedQuestions) {
          setSuggestedQuestions(data.suggestedQuestions);
        }
        setShowReflection(data.showReflection);
      } else {
        console.warn("Empty response from /api/chat");
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), content: "Sorry, I encountered an error. Please try again.", role: 'sage', timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isOrgReady]);

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
