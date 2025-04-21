
import { useCallback, useRef } from 'react';
import { fetchAuth } from '@/lib/backendAuth';
import { syncUserRole } from '@/lib/syncUserRole';
import { toast } from '@/components/ui/use-toast';

export function useSessionRefresh() {
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const sessionLastRefreshedRef = useRef<number>(Date.now());
  const sessionRefreshPromiseRef = useRef<Promise<void> | null>(null);
  const refreshErrorRef = useRef<Error | null>(null);
  const throttledAttemptsRef = useRef<number>(0);

  const refreshSession = useCallback(async (reason: string): Promise<void> => {
    if (isRefreshingRef.current && sessionRefreshPromiseRef.current) {
      console.log(`🔄 Session refresh already in progress (joining - reason: ${reason})`);
      return sessionRefreshPromiseRef.current;
    }
    
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - sessionLastRefreshedRef.current;
    const minimumRefreshInterval = 2000; // 2 seconds between refreshes
    
    // Enhanced throttling for repeated refresh attempts
    if (timeSinceLastRefresh < minimumRefreshInterval) {
      throttledAttemptsRef.current++;
      
      // Exponential backoff for repeated attempts
      const backoffTime = Math.min(
        minimumRefreshInterval * Math.pow(1.5, throttledAttemptsRef.current),
        30000 // Max 30 second backoff
      );
      
      if (!reason.includes('critical') && !reason.includes('post-login')) {
        console.log(`🔄 Session refreshed too recently (${timeSinceLastRefresh}ms ago), throttling for ${backoffTime}ms`);
        return Promise.resolve();
      }
    } else {
      // Reset throttle counter if enough time has passed
      throttledAttemptsRef.current = 0;
    }
    
    if (refreshErrorRef.current && !reason.includes('critical') && !reason.includes('post-login')) {
      const errorAge = currentTime - (refreshErrorRef.current as any).timestamp;
      if (errorAge < 5000) { // 5 second cool-down after errors
        console.log(`🔄 Session refresh had error ${errorAge}ms ago, cooling down before retry`);
        return Promise.resolve();
      }
    }
    
    isRefreshingRef.current = true;
    const refreshCount = ++refreshCountRef.current;
    
    sessionRefreshPromiseRef.current = new Promise<void>(async (resolve, reject) => {
      try {
        console.log(`🔄 Refreshing session #${refreshCount} (reason: ${reason}, time since last: ${timeSinceLastRefresh}ms) at ${new Date().toISOString()}`);
        
        // Only force check for critical reasons or first-time loads
        const forceCheck = reason.includes('critical') || reason.includes('post-login') || refreshCount === 1;
        const authData = await fetchAuth({ forceCheck });
        
        sessionLastRefreshedRef.current = Date.now();
        refreshErrorRef.current = null;
        
        if (refreshCount < refreshCountRef.current) {
          console.log(`🔄 Refresh #${refreshCount} superseded by newer refresh, discarding result`);
          isRefreshingRef.current = false;
          resolve();
          return;
        }
        
        if (!authData.session) {
          console.warn('⚠️ Session lost during refresh, user will need to login again');
          
          if (reason.includes('critical')) {
            toast({
              title: "Session expired",
              description: "Please refresh the page or sign in again.",
              variant: "destructive"
            });
          }
        }
        
        console.log(`✅ Session #${refreshCount} refreshed successfully at ${new Date().toISOString()}`);
        resolve();
      } catch (error) {
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
        
        reject(error);
      } finally {
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
      console.log("🔄 Session refresh throttling reset");
    }
  };
}
