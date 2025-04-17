
import { useState } from 'react';
import { useSageContextReadiness } from '../use-sage-context-readiness';
import { useAuth } from '@/contexts/auth/AuthContext';
import { HydrationState } from './types';
import { useHydrationTracking } from './use-hydration-tracking';

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
  const [hydrationProgress, setHydrationProgress] = useState<HydrationState>({
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
  
  // Track steps and update hydration progress
  useHydrationTracking(userId, contextReadiness, hydrationProgress, setHydrationProgress);
  
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
