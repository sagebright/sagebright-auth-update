import { useCallback, useRef } from 'react';
import { fetchAuth } from '@/lib/backendAuth';
import { syncUserRole } from '@/lib/syncUserRole';
import { toast } from '@/components/ui/use-toast';

export function useSessionRefresh() {
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const sessionLastRefreshedRef = useRef<number>(Date.now());
  const sessionRefreshPromiseRef = useRef<Promise<void> | null>(null);

  const refreshSession = useCallback(async (reason: string): Promise<void> => {
    if (isRefreshingRef.current && sessionRefreshPromiseRef.current) {
      console.log(`🔄 Session refresh already in progress (joining - reason: ${reason})`);
      return sessionRefreshPromiseRef.current;
    }
    
    isRefreshingRef.current = true;
    const refreshCount = ++refreshCountRef.current;
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - sessionLastRefreshedRef.current;
    
    sessionRefreshPromiseRef.current = new Promise<void>(async (resolve, reject) => {
      try {
        console.log(`🔄 Refreshing session #${refreshCount} (reason: ${reason}, time since last: ${timeSinceLastRefresh}ms) at ${new Date().toISOString()}`);
        const authData = await fetchAuth();
        
        sessionLastRefreshedRef.current = Date.now();
        
        if (refreshCount < refreshCountRef.current) {
          console.log(`🔄 Refresh #${refreshCount} superseded by newer refresh, discarding result`);
          isRefreshingRef.current = false;
          resolve();
          return;
        }
        
        if (!authData.session) {
          console.warn('⚠️ Session lost during refresh, user will need to login again');
          
          toast({
            title: "Session expired",
            description: "Please refresh the page or sign in again.",
            variant: "destructive"
          });
        }
        
        console.log(`✅ Session #${refreshCount} refreshed successfully at ${new Date().toISOString()}`);
        resolve();
      } catch (error) {
        console.error(`❌ Error refreshing session #${refreshCount}:`, error);
        
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
    getLastRefreshTime: () => sessionLastRefreshedRef.current
  };
}
