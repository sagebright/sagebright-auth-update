
/**
 * Logs hydration state information
 */
export function logHydrationState(
  userId: string | null,
  orgId: string | null, 
  orgSlug: string | null,
  userMetadata: any,
  hasBackendUserContext: boolean,
  hasBackendOrgContext: boolean,
  authLoading: boolean,
  timedOut: boolean
) {
  console.log("🔎 useContextHydration state:", {
    userId,
    orgId, 
    orgSlug,
    userMetadata: userMetadata ? JSON.stringify(userMetadata) : 'missing',
    hasBackendUserContext,
    hasBackendOrgContext,
    authLoading,
    timedOut
  });
}

/**
 * Logs backend context fetch status
 */
export function logBackendContextState(
  isLoading: boolean,
  error: Error | null,
  hasUserContext: boolean,
  hasOrgContext: boolean,
  contextReadyToRender: boolean,
  contextReadyToSend: boolean,
  timedOut: boolean,
  userContextFallback: boolean,
  orgContextFallback: boolean
) {
  console.log("🔄 Backend context fetch state:", {
    isLoading,
    error: error ? error.message : null,
    hasUserContext,
    hasOrgContext,
    contextReadyToRender,
    contextReadyToSend,
    timedOut,
    userContextFallback,
    orgContextFallback
  });
}

/**
 * Log timeout warning
 */
export function logTimeoutWarning(
  maxTime: number,
  startTime: number | null,
  currentTime: number
) {
  console.warn("⚠️ Context hydration timeout exceeded", {
    maxTime,
    startTime,
    currentTime
  });
}
