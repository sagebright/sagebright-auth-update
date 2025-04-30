
import { useContextHydration } from './hydration';
import { useAuth } from '@/contexts/auth/AuthContext';
import { SageContext } from '@/types/chat';

/**
 * Hook to access the unified Sage context (user + org) for the application
 * This should be the primary way to access context in the frontend
 */
export function useSageContext() {
  console.log("🧠 useSageContext hook initialized");
  
  const { userId, orgId, user } = useAuth();
  const orgSlug = user?.user_metadata?.org_slug ?? null;
  
  // Use the canonical hydration hook instead of custom fetch logic
  const {
    backendContext: { userContext, orgContext, error },
    hydration: {
      isComplete,
      progressPercent,
      startTime,
      endTime,
      duration,
      completedSteps
    },
    isReadyToRender,
    isReadyToSend,
    blockers,
    isVoiceReady,
    isBackendContextReady
  } = useContextHydration();
  
  // Construct the context object that matches the expected format
  const context: SageContext | null = isBackendContextReady ? {
    user: userContext,
    org: orgContext,
    userId,
    orgId,
    messages: [],
    _meta: {
      hydratedAt: endTime ? new Date(endTime).toISOString() : new Date().toISOString(),
      voiceConfig: null,
      timeout: !isComplete && startTime && (Date.now() - startTime) > 5000
    }
  } : null;
  
  // Determine if hydration timed out
  const timedOut = !isComplete && startTime && (Date.now() - startTime) > 5000;
  
  const result = {
    context,
    loading: !isComplete && !timedOut,
    error,
    timedOut,
    userContext,
    orgContext,
    voiceConfig: null, // This can be populated from context._meta if needed
    isReady: isReadyToRender && isBackendContextReady,
    hydrationAttempts: completedSteps ? completedSteps.length : 0,
    lastHydrationTime: endTime,
    blockers,
    // Provide a fallback message when timed out
    fallbackMessage: timedOut ? 
      "I'm sorry, but we're having trouble loading your information. You can continue, but some personalized features might be limited." : 
      null,
    // Additional helpful metrics
    hydrationProgress: progressPercent,
    hydrationDuration: duration,
    canSendMessages: isReadyToSend
  };

  // Log only on significant state changes to avoid console spam
  if (result.isReady || timedOut || error) {
    console.log("📤 useSageContext state update", {
      loading: result.loading,
      hasError: !!error,
      isReady: result.isReady,
      hydrationAttempts: result.hydrationAttempts,
      timedOut,
      hasContext: !!context,
      progressPercent
    });
  }

  return result;
}

export default useSageContext;
