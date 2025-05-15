
import { useEffect, useRef } from 'react';
import { MAX_HYDRATION_TIME, createFallbackContexts, showTimeoutToast } from '../utils/timeout-handler';
import { logTimeoutWarning } from '../utils/logging';

/**
 * Hook to handle timeout fallback for context hydration
 */
export function useTimeoutFallback(
  startTime: number | null,
  isLoading: boolean,
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  onTimeout: (fallbackData: any) => void
) {
  // Add timeout reference for hydration
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!startTime) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to provide a fallback experience if hydration takes too long
    timeoutRef.current = window.setTimeout(() => {
      logTimeoutWarning(MAX_HYDRATION_TIME, startTime, Date.now());
      
      // Only set timeout if we're still loading
      if (isLoading) {
        const fallbackContexts = createFallbackContexts(userId, orgId, orgSlug);
        
        onTimeout({
          ...fallbackContexts,
          error: new Error("Context hydration timed out")
        });
        
        showTimeoutToast();
      }
    }, MAX_HYDRATION_TIME);
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [startTime, isLoading, userId, orgId, orgSlug, onTimeout]);
}
