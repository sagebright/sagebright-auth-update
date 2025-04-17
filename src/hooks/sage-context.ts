
import { useSageContextReadiness } from './sage-context/use-sage-context-readiness';
import { useSageContext as useSageContextHook } from './sage-context/use-sage-context';
import { useContextHydration } from './sage-context/hydration';

/**
 * Consolidated hook to provide all necessary context for Sage functionality
 * Prevents direct database queries by centralizing context access
 */
export function useSageContext(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean,
  voiceParam: string | null = null
) {
  // Use the enhanced readiness hook
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    isSessionUserReady,
    voiceParam
  );

  return {
    ...contextReadiness,
    
    // Add context-specific helpers
    isFullyHydrated: contextReadiness.isReadyToSend && 
                     contextReadiness.isBackendContextReady &&
                     !contextReadiness.blockers.length,
    
    contextSources: {
      auth: 'auth-context',
      user: contextReadiness.isUserMetadataReady ? 'backend-context' : 'pending',
      org: contextReadiness.isOrgMetadataReady ? 'backend-context' : 'pending',
      voice: contextReadiness.isVoiceReady ? 'param' : 'pending'
    }
  };
}

// For better semantic naming, export the hook with its proper name
export { useSageContextHook as useSageContext };
export { useContextHydration };
export type { SageContextReadiness } from './sage-context/types';
export { useSageContextReadiness };
