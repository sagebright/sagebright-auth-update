
import { useEffect } from 'react';
import { HydrationState } from './types';
import { SageContextReadiness } from '../types';

/**
 * Hook to track hydration progress for context
 */
export function useHydrationTracking(
  userId: string | null,
  contextReadiness: SageContextReadiness,
  hydrationProgress: HydrationState,
  setHydrationProgress: React.Dispatch<React.SetStateAction<HydrationState>>
) {
  useEffect(() => {
    // Only track hydration if we have a userId
    if (!userId) return;
    
    // Initialize startTime if not set and we're starting the process
    if (hydrationProgress.startTime === null) {
      setHydrationProgress(prev => ({
        ...prev,
        startTime: Date.now()
      }));
    }
    
    // Track completed steps based on readiness flags
    const completedSteps: string[] = [];
    
    if (contextReadiness.isAuthReady) {
      completedSteps.push('auth');
    }
    
    if (contextReadiness.isSessionReady) {
      completedSteps.push('session');
    }
    
    if (contextReadiness.isUserMetadataReady) {
      completedSteps.push('user_metadata');
    }
    
    if (contextReadiness.isOrgReady) {
      completedSteps.push('org');
    }
    
    if (contextReadiness.isVoiceReady) {
      completedSteps.push('voice');
    }
    
    // Update progress if steps have changed
    if (JSON.stringify(completedSteps) !== JSON.stringify(hydrationProgress.completedSteps)) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps,
        // Also update progress percentage
        progressPercent: Math.round((completedSteps.length / prev.totalSteps) * 100)
      }));
    }
    
    // Mark as complete when ready to render
    if (contextReadiness.isReadyToRender && !hydrationProgress.endTime) {
      const endTime = Date.now();
      setHydrationProgress(prev => ({
        ...prev,
        endTime,
        duration: prev.startTime ? endTime - prev.startTime : null,
        isComplete: true
      }));
      
      // Log completion
      console.log('✅ Context hydration complete', {
        duration: hydrationProgress.startTime ? `${endTime - hydrationProgress.startTime}ms` : 'unknown',
        steps: completedSteps,
        timestamp: new Date(endTime).toISOString()
      });
    }
  }, [userId, contextReadiness, hydrationProgress, setHydrationProgress]);
}
