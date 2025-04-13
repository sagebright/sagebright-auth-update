
import { useState, useEffect } from 'react';

/**
 * Hook for managing the reflection panel state
 */
export function useReflection(userId: string | null, messagesLength: number) {
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    if (!userId) return;
    
    const timer = setTimeout(() => {
      if (messagesLength > 1 && !showReflection && Math.random() > 0.7) {
        setShowReflection(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [messagesLength, showReflection, userId]);

  return {
    showReflection,
    setShowReflection
  };
}

