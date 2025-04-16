
import { useSageContextReadiness } from './sage-context';

/**
 * @deprecated Use useSageContextReadiness instead
 * This hook is kept for backwards compatibility.
 */
export function useSageContextReady(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean,
  voiceParam: string | null = null
) {
  const { 
    isContextReady, 
    contextCheckComplete, 
    missingContext,
    isSessionStable 
  } = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    isSessionUserReady,
    voiceParam
  );

  return {
    isContextReady,
    contextCheckComplete,
    missingContext,
    isSessionStable
  };
}
