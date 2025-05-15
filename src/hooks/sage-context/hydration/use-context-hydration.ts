
import { useState, useEffect, useRef } from 'react';
import { useSageContextReadiness } from '../use-sage-context-readiness';
import { useAuth } from '@/contexts/auth/AuthContext';
import { HydrationState, ContextHydrationParams } from './types';
import { useHydrationTracking } from './use-hydration-tracking';
import { hydrateSageContext } from '@/lib/api/sageContextApi';
import { toast } from '@/components/ui/use-toast';

// Maximum time to wait for context hydration before using fallback
const MAX_HYDRATION_TIME = 10000; // 10 seconds

/**
 * Hook to track and ensure complete context hydration
 * Works with the unified context system
 */
export function useContextHydration(
  params: ContextHydrationParams, // Updated to use the proper type
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
  const [backendContext, setBackendContext] = useState({
    userContext: userContext,
    orgContext: orgContext,
    isLoading: false,
    error: null,
    timedOut: false
  });
  
  // Add timeout reference for hydration
  const hydrationTimeoutRef = useRef<number | null>(null);
  
  // Extract the orgSlug from user metadata
  const orgSlug = user?.user_metadata?.org_slug ?? null;
  
  // DETAILED LOGGING: Extra information about user and org state
  console.log("🔎 useContextHydration state:", {
    userId,
    orgId, 
    orgSlug,
    userMetadata: user?.user_metadata ? JSON.stringify(user.user_metadata) : 'missing',
    hasBackendUserContext: !!backendContext.userContext,
    hasBackendOrgContext: !!backendContext.orgContext,
    authLoading,
    timedOut: backendContext.timedOut
  });
  
  // Trigger timeout fallback if hydration takes too long
  useEffect(() => {
    if (!hydrationProgress.startTime) return;
    
    // Clear any existing timeout
    if (hydrationTimeoutRef.current) {
      window.clearTimeout(hydrationTimeoutRef.current);
    }
    
    // Set a timeout to provide a fallback experience if hydration takes too long
    hydrationTimeoutRef.current = window.setTimeout(() => {
      console.warn("⚠️ Context hydration timeout exceeded", {
        maxTime: MAX_HYDRATION_TIME,
        startTime: hydrationProgress.startTime,
        currentTime: Date.now()
      });
      
      // Only set timeout if we're still loading
      if (backendContext.isLoading) {
        setBackendContext(prev => ({ 
          ...prev, 
          isLoading: false,
          timedOut: true,
          // Create minimal fallback contexts to satisfy readiness checks
          userContext: prev.userContext || { 
            _fallback: true, 
            id: userId || 'fallback-user'
          },
          orgContext: prev.orgContext || {
            _fallback: true,
            id: orgId || 'fallback-org',
            slug: orgSlug || 'fallback-slug'
          },
          error: new Error("Context hydration timed out")
        }));
        
        // Show a toast to the user about the partial data
        toast({
          title: "Some data may be incomplete",
          description: "We're having trouble loading all your information, but you can continue using the app with limited personalization.",
          duration: 5000
        });
      }
    }, MAX_HYDRATION_TIME);
    
    return () => {
      if (hydrationTimeoutRef.current) {
        window.clearTimeout(hydrationTimeoutRef.current);
      }
    };
  }, [hydrationProgress.startTime, backendContext.isLoading, userId, orgId, orgSlug]);
  
  // Fetch context from the backend when dependencies change
  useEffect(() => {
    // Skip if we don't have the necessary IDs yet
    if (!userId || !orgId || authLoading) {
      console.log("⏳ Waiting for auth data before fetching context", { userId, orgId, authLoading });
      return;
    }

    let isMounted = true;
    setBackendContext(prev => ({ ...prev, isLoading: true }));
    
    console.log("🔄 Fetching Sage context from backend", { userId, orgId, orgSlug });
    
    hydrateSageContext(userId, orgId, orgSlug)
      .then(context => {
        if (!isMounted) return;
        
        if (context) {
          console.log("🧠 Live Sage context:", context);
          setBackendContext({
            userContext: context.user || null,
            orgContext: context.org || null,
            isLoading: false,
            error: null,
            timedOut: false
          });
        } else {
          console.warn("⚠️ No context data returned from API");
          setBackendContext(prev => ({ 
            ...prev, 
            isLoading: false,
            // Create minimal fallback contexts on API failure
            userContext: prev.userContext || {
              _fallback: true,
              id: userId
            },
            orgContext: prev.orgContext || {
              _fallback: true,
              id: orgId,
              slug: orgSlug || 'default-org'
            },
            error: new Error("Failed to load context data")
          }));
        }
      })
      .catch(error => {
        if (!isMounted) return;
        console.error("❌ Error fetching context:", error);
        setBackendContext(prev => ({ 
          ...prev, 
          isLoading: false,
          // Create minimal fallback contexts on error
          userContext: prev.userContext || {
            _fallback: true,
            id: userId
          },
          orgContext: prev.orgContext || {
            _fallback: true,
            id: orgId,
            slug: orgSlug || 'default-org'
          },
          error: error instanceof Error ? error : new Error("Unknown error fetching context")
        }));
      });
    
    return () => {
      isMounted = false;
    };
  }, [userId, orgId, orgSlug, authLoading]);
  
  // Use the context readiness hook with provided context
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    sessionUserReady,
    voiceParam: null, // Use default value
    {
      userContext: backendContext.userContext,
      orgContext: backendContext.orgContext
    }
  );
  
  // DETAILED LOGGING: Log backend context fetch status
  console.log("🔄 Backend context fetch state:", {
    isLoading: backendContext.isLoading,
    error: backendContext.error ? backendContext.error.message : null,
    hasUserContext: !!backendContext.userContext,
    hasOrgContext: !!backendContext.orgContext,
    contextReadyToRender: contextReadiness.isReadyToRender,
    contextReadyToSend: contextReadiness.isReadyToSend,
    timedOut: backendContext.timedOut,
    userContextFallback: backendContext.userContext?._fallback || false,
    orgContextFallback: backendContext.orgContext?._fallback || false
  });
  
  // Track steps and update hydration progress
  useHydrationTracking(userId, contextReadiness, hydrationProgress, setHydrationProgress);
  
  return {
    ...contextReadiness,
    backendContext: {
      ...backendContext,
      // Add fallback handling
      userContext: backendContext.userContext || (backendContext.timedOut ? { _fallback: true, id: userId } : null),
      orgContext: backendContext.orgContext || (backendContext.timedOut ? { _fallback: true, id: orgId, slug: orgSlug || 'default-org' } : null)
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
