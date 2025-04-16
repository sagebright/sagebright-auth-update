
import { useState, useCallback } from 'react';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

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
      toast({
        variant: "destructive",
        title: "Sage isn't quite ready yet",
        description: "Please wait a moment and try again.",
      });
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

      // Check content type to avoid HTML parsing errors
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("🧨 Invalid content type:", contentType);
        const rawResponse = await response.text();
        console.log("Raw response (first 100 chars):", rawResponse.substring(0, 100));
        throw new Error(`Expected JSON response but got ${contentType || 'unknown'}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("🧨 Failed to parse Sage response as JSON:", parseError);
        console.log("Response status:", response.status);
        throw new Error("Sage server error. Failed to parse response as JSON.");
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
        throw new Error("Sage returned an empty response");
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      // Add a user-friendly error message
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          id: uuidv4(), 
          content: "Sorry, I encountered an error processing your request. Please try again in a moment.", 
          role: 'sage', 
          timestamp: new Date() 
        },
      ]);
      
      toast({
        variant: "destructive",
        title: "Sage encountered an error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
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
