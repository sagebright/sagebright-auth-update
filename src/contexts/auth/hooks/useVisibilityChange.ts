
import { useEffect, useRef, useCallback } from 'react';

interface VisibilityHandlers {
  onVisible?: () => void;
  onHidden?: () => void;
}

export function useVisibilityChange({ onVisible, onHidden }: VisibilityHandlers) {
  const lastFocusTimeRef = useRef<number>(Date.now());
  const wasHiddenRef = useRef<boolean>(false);
  
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      const timeSinceLastFocus = Date.now() - lastFocusTimeRef.current;
      lastFocusTimeRef.current = Date.now();
      
      console.log(`👁️ Tab visibility changed to visible after ${timeSinceLastFocus}ms at ${new Date().toISOString()}`);
      
      if (wasHiddenRef.current && onVisible) {
        wasHiddenRef.current = false;
        onVisible();
      }
    } else if (document.visibilityState === 'hidden') {
      wasHiddenRef.current = true;
      console.log(`👁️ Tab visibility changed to hidden at ${new Date().toISOString()}`);
      
      if (onHidden) {
        onHidden();
      }
    }
  }, [onVisible, onHidden]);

  const handleWindowFocus = useCallback(() => {
    const timeSinceLastFocus = Date.now() - lastFocusTimeRef.current;
    lastFocusTimeRef.current = Date.now();
    
    console.log(`🔍 Window focused after ${timeSinceLastFocus}ms at ${new Date().toISOString()}`);
    
    if (wasHiddenRef.current && onVisible) {
      wasHiddenRef.current = false;
      onVisible();
    }
  }, [onVisible]);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [handleVisibilityChange, handleWindowFocus]);

  return {
    wasHidden: () => wasHiddenRef.current,
    getLastFocusTime: () => lastFocusTimeRef.current
  };
}
