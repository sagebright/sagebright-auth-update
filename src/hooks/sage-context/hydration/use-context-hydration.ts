
import { useState } from 'react';
import { useSageContextReadiness } from '../use-sage-context-readiness';
import { useAuth } from '@/contexts/auth/AuthContext';
import { HydrationState, ContextHydrationParams, BackendContextState } from './types';
import { useHydrationTracking } from './use-hydration-tracking';
import { createInitialBackendState } from './utils/backend-fetch';
import { createFallbackContexts } from './utils/timeout-handler';
import { logHydrationState, logBackendContextState } from './utils/logging';
import { useTimeoutFallback } from './hooks/use-timeout-fallback';
import { useBackendContextFetch } from './hooks/use-backend-context-fetch';

/**
 * Hook to track and ensure complete context hydration
 * Works with the unified context system
 */
export function useContextHydration(
  params: ContextHydrationParams,
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
    completedSteps: [], // Initialize as empty array to match string[] type
    totalSteps: 5, // Auth, Session, User Metadata, Org, and Voice
    progressPercent: 0,
    isComplete: false,
    timedOut: false
  });

  // Track backend context state
  const [backendContext, setBackendContext] = useState<BackendContextState>(
    createInitialBackendState(userContext, orgContext)
  );
  
  // Extract the orgSlug from user metadata
  const orgSlug = user?.user_metadata?.org_slug ?? null;
  
  // Log hydration state information
  logHydrationState(
    userId, 
    orgId, 
    orgSlug, 
    user?.user_metadata, 
    !!backendContext.userContext,
    !!backendContext.orgContext,
    authLoading,
    backendContext.timedOut
  );
  
  // Handle timeout fallback
  useTimeoutFallback(
    hydrationProgress.startTime,
    backendContext.isLoading,
    userId,
    orgId,
    orgSlug,
    (fallbackData) => {
      setBackendContext(prev => ({ 
        ...prev, 
        isLoading: false,
        timedOut: true,
        userContext: prev.userContext || fallbackData.userContext,
        orgContext: prev.orgContext || fallbackData.orgContext,
        error: fallbackData.error
      }));
    }
  );
  
  // Fetch backend context
  useBackendContextFetch(
    userId,
    orgId,
    orgSlug,
    authLoading,
    setBackendContext,
    createFallbackContexts
  );
  
  // Use the context readiness hook with provided context
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    sessionUserReady,
    null, // Use default value for voiceParam
    {
      userContext: backendContext.userContext,
      orgContext: backendContext.orgContext
    }
  );
  
  // Log backend context fetch status
  logBackendContextState(
    backendContext.isLoading,
    backendContext.error,
    !!backendContext.userContext,
    !!backendContext.orgContext,
    contextReadiness.isReadyToRender,
    contextReadiness.isReadyToSend,
    backendContext.timedOut,
    backendContext.userContext?._fallback || false,
    backendContext.orgContext?._fallback || false
  );
  
  // Track steps and update hydration progress
  useHydrationTracking(userId, contextReadiness, hydrationProgress, setHydrationProgress);
  
  return {
    ...contextReadiness,
    backendContext: {
      ...backendContext,
      // Add fallback handling
      userContext: backendContext.userContext || (backendContext.timedOut ? 
        createFallbackContexts(userId, orgId, orgSlug).userContext : null),
      orgContext: backendContext.orgContext || (backendContext.timedOut ? 
        createFallbackContexts(userId, orgId, orgSlug).orgContext : null)
    },
    hydration: {
      ...hydrationProgress,
      isComplete: !!hydrationProgress.endTime || backendContext.timedOut,
      progressPercent: backendContext.timedOut ? 100 : Math.round(
        (hydrationProgress.completedSteps.length / hydrationProgress.totalSteps) * 100
      ),
      timedOut: backendContext.timedOut
    }
  };
}
