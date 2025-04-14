
import { useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncUserRole } from '@/lib/syncUserRole';
import { toast } from '@/components/ui/use-toast';

export function useSessionRefresh() {
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const sessionLastRefreshedRef = useRef<number>(Date.now());
  const sessionRefreshPromiseRef = useRef<Promise<void> | null>(null);

  // Enhanced function to refresh the session with better debounce, error handling, and promise management
  const refreshSession = useCallback(async (reason: string): Promise<void> => {
    // If there's already a refresh in progress, return that promise instead of starting a new one
    if (isRefreshingRef.current && sessionRefreshPromiseRef.current) {
      console.log(`🔄 Session refresh already in progress (joining - reason: ${reason})`);
      return sessionRefreshPromiseRef.current;
    }
    
    // Start a new refresh
    isRefreshingRef.current = true;
    const refreshCount = ++refreshCountRef.current;
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - sessionLastRefreshedRef.current;
    
    // Create a new promise for this refresh operation
    sessionRefreshPromiseRef.current = new Promise<void>(async (resolve, reject) => {
      try {
        console.log(`🔄 Refreshing session #${refreshCount} (reason: ${reason}, time since last: ${timeSinceLastRefresh}ms) at ${new Date().toISOString()}`);
        const { data, error } = await supabase.auth.getSession();
        
        // Update the last refreshed timestamp
        sessionLastRefreshedRef.current = Date.now();
        
        // Check if this refresh is still relevant (not superseded by a newer one)
        if (refreshCount < refreshCountRef.current) {
          console.log(`🔄 Refresh #${refreshCount} superseded by newer refresh, discarding result`);
          isRefreshingRef.current = false;
          resolve(); // Still resolve the promise
          return;
        }
        
        if (error) {
          throw error;
        }
        
        if (!data.session && refreshCount === refreshCountRef.current) {
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
        
        // If this is a critical operation, show a toast
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

  // Function to handle session metadata recovery
  const repairSessionMetadata = useCallback(async (userId: string): Promise<boolean> => {
    console.warn('⚠️ User metadata missing role, attempting to repair');
    try {
      await syncUserRole(userId);
      console.log('✅ Role synchronized on repair');
      
      // Refresh session to get updated metadata
      const { data: refreshData } = await supabase.auth.getSession();
      if (refreshData.session) {
        console.log('🔄 User metadata after role sync repair:', refreshData.session.user.user_metadata);
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
