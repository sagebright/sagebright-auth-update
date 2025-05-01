import { useState, useEffect } from 'react';
import { useSageContextReadiness } from './use-sage-context-readiness';
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * Hook to track and ensure complete context hydration
 * Works with the unified context system
 */
export function useContextHydration(
  voiceParam: string | null = null,
  userContext: any | null = null,
  orgContext: any | null = null
) {
  const { 
    userId, 
    orgId, 
    user, 
    loading: authLoading,
    sessionUserReady = !!user  // Default to using user presence as fallback
  } = useAuth();
  
  // Track hydration progress
  const [hydrationProgress, setHydrationProgress] = useState<{
    startTime: number | null;
    endTime: number | null;
    duration: number | null;
    completedSteps: string[];
    totalSteps: number;
  }>({
    startTime: null,
    endTime: null,
    duration: null,
    completedSteps: [],
    totalSteps: 5 // Auth, Session, User Metadata, Org, and Voice
  });
  
  // Extract the orgSlug from user metadata
  const orgSlug = user?.user_metadata?.org_slug ?? null;
  
  // Use the context readiness hook with provided context
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    sessionUserReady,
    voiceParam,
    {
      userContext,
      orgContext
    }
  );
  
  // Start tracking hydration when user signs in
  useEffect(() => {
    if (userId && !hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        startTime: Date.now(),
        completedSteps: [...prev.completedSteps, 'authentication']
      }));
    }
  }, [userId, hydrationProgress.startTime]);
  
  // Track completion of auth step
  useEffect(() => {
    if (contextReadiness.isAuthReady && 
        !hydrationProgress.completedSteps.includes('auth') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'auth']
      }));
    }
  }, [contextReadiness.isAuthReady, hydrationProgress]);
  
  // Track completion of session step
  useEffect(() => {
    if (contextReadiness.isSessionReady && 
        !hydrationProgress.completedSteps.includes('session') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'session']
      }));
    }
  }, [contextReadiness.isSessionReady, hydrationProgress]);
  
  // Track completion of org step
  useEffect(() => {
    if (contextReadiness.isOrgReady && 
        !hydrationProgress.completedSteps.includes('org') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'org']
      }));
    }
  }, [contextReadiness.isOrgReady, hydrationProgress]);
  
  // Track completion of voice step
  useEffect(() => {
    if (contextReadiness.isVoiceReady && 
        !hydrationProgress.completedSteps.includes('voice') && 
        hydrationProgress.startTime) {
      setHydrationProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, 'voice']
      }));
    }
  }, [contextReadiness.isVoiceReady, hydrationProgress]);
  
  // Calculate hydration completion
  useEffect(() => {
    if (contextReadiness.isReadyToRender && hydrationProgress.startTime && !hydrationProgress.endTime) {
      const endTime = Date.now();
      const duration = endTime - hydrationProgress.startTime;
      
      setHydrationProgress(prev => ({
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
  }, [contextReadiness.isReadyToRender, hydrationProgress]);
  
  return {
    ...contextReadiness,
    backendContext: {
      userContext,
      orgContext,
      isLoading: false,
      error: null
    },
    hydration: {
      ...hydrationProgress,
      isComplete: !!hydrationProgress.endTime,
      progressPercent: Math.round(
        (hydrationProgress.completedSteps.length / hydrationProgress.totalSteps) * 100
      )
    }
  };
}
