
import { useState, useEffect } from 'react';

export const useSageUIState = (messages: any[]) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Update welcome message visibility based on messages
  useEffect(() => {
    setShowWelcomeMessage(messages.length === 0);
  }, [messages.length]);

  return {
    sidebarOpen,
    setSidebarOpen,
    isRecoveryVisible,
    setIsRecoveryVisible,
    pageInitialized,
    setPageInitialized,
    showWelcomeMessage
  };
};
