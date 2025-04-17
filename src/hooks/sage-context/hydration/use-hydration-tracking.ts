
import { useEffect } from 'react';
import { SageContextReadiness } from '../types';
import { HydrationState } from './types';

/**
 * Custom hook to track hydration steps based on context readiness changes
 */
export function useHydrationTracking(
  userId: string | null,
  contextReadiness: SageContextReadiness,
  hydrationProgress: HydrationState,
  setHydrationProgress: React.Dispatch<React.SetStateAction<HydrationState>>
) {
  // Start tracking hydration when user signs in
  useEffect(() => {
    if (userId && !hydrationProgress.startTime) {
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        startTime: Date.now(),
        completedSteps: [...prev.completedSteps, 'authentication']
      }));
    }
  }, [userId, hydrationProgress.startTime, setHydrationProgress]);
  
  // Track completion of auth step
  useEffect(() => {
    if (contextReadiness.isAuthReady && 
        !hydrationProgress.completedSteps.includes('auth') && 
        hydrationProgress.startTime) {
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'auth']
      }));
    }
  }, [contextReadiness.isAuthReady, hydrationProgress, setHydrationProgress]);
  
  // Track completion of session step
  useEffect(() => {
    if (contextReadiness.isSessionReady && 
        !hydrationProgress.completedSteps.includes('session') && 
        hydrationProgress.startTime) {
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'session']
      }));
    }
  }, [contextReadiness.isSessionReady, hydrationProgress, setHydrationProgress]);
  
  // Track completion of org step
  useEffect(() => {
    if (contextReadiness.isOrgReady && 
        !hydrationProgress.completedSteps.includes('org') && 
        hydrationProgress.startTime) {
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'org']
      }));
    }
  }, [contextReadiness.isOrgReady, hydrationProgress, setHydrationProgress]);
  
  // Track completion of voice step
  useEffect(() => {
    if (contextReadiness.isVoiceReady && 
        !hydrationProgress.completedSteps.includes('voice') && 
        hydrationProgress.startTime) {
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'voice']
      }));
    }
  }, [contextReadiness.isVoiceReady, hydrationProgress, setHydrationProgress]);
  
  // Calculate hydration completion
  useEffect(() => {
    if (contextReadiness.isReadyToRender && hydrationProgress.startTime && !hydrationProgress.endTime) {
      const endTime = Date.now();
      const duration = endTime - hydrationProgress.startTime;
      
      setHydrationProgress((prev: HydrationState) => ({
        ...prev,
        endTime,
        duration
      }));
      
      console.log(`✅ Context hydration complete in ${duration}ms`, {
        startTime: new Date(hydrationProgress.startTime!).toISOString(),
        endTime: new Date(endTime).toISOString(),
        completedSteps: [...hydrationProgress.completedSteps, 'ready_to_render']
      });
    }
  }, [contextReadiness.isReadyToRender, hydrationProgress, setHydrationProgress]);
}
