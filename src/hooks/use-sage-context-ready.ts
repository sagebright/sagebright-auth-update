
// This file is kept for backwards compatibility but functionality has moved to use-sage-context-readiness.ts
import { useSageContextReadiness } from './use-sage-context-readiness';

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
  isSessionUserReady: boolean
) {
  const { 
    isContextReady, 
    contextCheckComplete, 
    missingContext 
  } = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    isSessionUserReady
  );

  return {
    isContextReady,
    contextCheckComplete,
    missingContext
  };
}
