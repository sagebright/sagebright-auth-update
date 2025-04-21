
import { useCallback, useRef } from 'react';
import { fetchAuth } from '@/lib/backendAuth';
import { syncUserRole } from '@/lib/syncUserRole';
import { toast } from '@/components/ui/use-toast';

// Throttle logging
let lastSessionRefreshLog = 0;
const SESSION_LOG_THROTTLE = 10000; // 10 seconds (increased from 5s)

export function useSessionRefresh() {
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const sessionLastRefreshedRef = useRef<number>(Date.now());
  const sessionRefreshPromiseRef = useRef<Promise<void> | null>(null);
  const refreshErrorRef = useRef<Error | null>(null);
  const throttledAttemptsRef = useRef<number>(0);
  const timeoutIdRef = useRef<number | null>(null);

  // Conditionally log based on importance and time
  const logIfNeeded = (message: string, data?: any, force: boolean = false) => {
    const now = Date.now();
    if (force || now - lastSessionRefreshLog > SESSION_LOG_THROTTLE) {
      lastSessionRefreshLog = now;
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
      return true;
    }
    return false;
  };

  const refreshSession = useCallback(async (reason: string): Promise<void> => {
    if (isRefreshingRef.current && sessionRefreshPromiseRef.current) {
      logIfNeeded(`🔄 Session refresh already in progress (joining - reason: ${reason})`, null, false);
      return sessionRefreshPromiseRef.current;
    }
    
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - sessionLastRefreshedRef.current;
    const minimumRefreshInterval = 5000; // 5 seconds between refreshes (increased from 2s)
    
    // Enhanced throttling for repeated refresh attempts
    if (timeSinceLastRefresh < minimumRefreshInterval) {
      throttledAttemptsRef.current++;
      
      // Exponential backoff for repeated attempts
      const backoffTime = Math.min(
        minimumRefreshInterval * Math.pow(1.5, throttledAttemptsRef.current),
        60000 // Max 60 second backoff (increased from 30s)
      );
      
      if (!reason.includes('critical') && !reason.includes('post-login')) {
        logIfNeeded(`🔄 Session refreshed too recently (${timeSinceLastRefresh}ms ago), throttling for ${backoffTime}ms`, null, false);
        return Promise.resolve();
      }
    } else {
      // Reset throttle counter if enough time has passed
      throttledAttemptsRef.current = 0;
    }
    
    if (refreshErrorRef.current && !reason.includes('critical') && !reason.includes('post-login')) {
      const errorAge = currentTime - (refreshErrorRef.current as any).timestamp;
      if (errorAge < 10000) { // 10 second cool-down after errors (increased from 5s)
        logIfNeeded(`🔄 Session refresh had error ${errorAge}ms ago, cooling down before retry`, null, false);
        return Promise.resolve();
      }
    }
    
    isRefreshingRef.current = true;
    const refreshCount = ++refreshCountRef.current;
    
    // Only log important session refreshes or periodic updates
    const isCriticalRefresh = reason.includes('critical') || reason.includes('post-login');
    
    sessionRefreshPromiseRef.current = new Promise<void>(async (resolve, reject) => {
      // Clear any existing timeout
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Set timeout for this operation
      const timeoutId = window.setTimeout(() => {
        logIfNeeded(`⚠️ Session refresh ${refreshCount} timed out after 15 seconds`, null, true);
        isRefreshingRef.current = false;
        sessionRefreshPromiseRef.current = null;
        timeoutIdRef.current = null;
        reject(new Error("Session refresh timed out"));
      }, 15000);
      
      timeoutIdRef.current = timeoutId as unknown as number;
      
      try {
        logIfNeeded(`🔄 Refreshing session #${refreshCount} (reason: ${reason}, time since last: ${timeSinceLastRefresh}ms) at ${new Date().toISOString()}`, null, isCriticalRefresh);
        
        // Only force check for critical reasons or first-time loads
        const forceCheck = reason.includes('critical') || reason.includes('post-login') || refreshCount === 1;
        const authData = await fetchAuth({ forceCheck });
        
        sessionLastRefreshedRef.current = Date.now();
        refreshErrorRef.current = null;
        
        if (refreshCount < refreshCountRef.current) {
          logIfNeeded(`🔄 Refresh #${refreshCount} superseded by newer refresh, discarding result`, null, false);
          window.clearTimeout(timeoutId);
          timeoutIdRef.current = null;
          isRefreshingRef.current = false;
          resolve();
          return;
        }
        
        if (!authData.session) {
          // Only warn about session loss for critical refreshes
          if (isCriticalRefresh) {
            console.warn('⚠️ Session lost during refresh, user will need to login again');
            
            if (reason.includes('critical')) {
              toast({
                title: "Session expired",
                description: "Please refresh the page or sign in again.",
                variant: "destructive"
              });
            }
          }
        }
        
        // Only log successful completion for critical refreshes
        if (isCriticalRefresh) {
          logIfNeeded(`✅ Session #${refreshCount} refreshed successfully at ${new Date().toISOString()}`);
        }
        window.clearTimeout(timeoutId);
        timeoutIdRef.current = null;
        resolve();
      } catch (error) {
        // Always log refresh errors
        console.error(`❌ Error refreshing session #${refreshCount}:`, error);
        
        refreshErrorRef.current = error as Error;
        (refreshErrorRef.current as any).timestamp = Date.now();
        
        if (reason.includes('critical')) {
          toast({
            title: "Authentication error",
            description: "There was an issue with your session. Please try refreshing the page.",
            variant: "destructive"
          });
        }
        
        window.clearTimeout(timeoutId);
        timeoutIdRef.current = null;
        reject(error);
      } finally {
        if (timeoutIdRef.current === timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutIdRef.current = null;
        }
        isRefreshingRef.current = false;
        sessionRefreshPromiseRef.current = null;
      }
    });
    
    return sessionRefreshPromiseRef.current;
  }, []);

  const repairSessionMetadata = useCallback(async (userId: string): Promise<boolean> => {
    console.warn('⚠️ User metadata missing role, attempting to repair');
    try {
      await syncUserRole(userId);
      console.log('✅ Role synchronized on repair');
      
      const refreshData = await fetchAuth();
      if (refreshData.session) {
        console.log('🔄 User metadata after role sync repair:', refreshData.user ? refreshData.user.role : 'No user data');
        return true;
      }
      return false;
    } catch (syncError) {
      console.error('❌ Role sync failed on repair:', syncError);
      return false;
    }
  }, []);

  return {
    refreshSession,
    repairSessionMetadata,
    isRefreshing: () => isRefreshingRef.current,
    getLastRefreshTime: () => sessionLastRefreshedRef.current,
    resetThrottling: () => {
      throttledAttemptsRef.current = 0;
      logIfNeeded("🔄 Session refresh throttling reset");
    }
  };
}
