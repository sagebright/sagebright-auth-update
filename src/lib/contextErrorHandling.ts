
/**
 * Error handling utilities for context building
 */

/**
 * Creates a fallback context response when organization context is missing
 * 
 * @param userId - User ID for context
 * @param orgId - Organization ID for context
 * @returns A basic context object with an error message
 */
export function createOrgContextFallback(userId: string, orgId: string) {
  console.warn("Creating fallback context due to missing org data", { userId, orgId });
  
  return {
    messages: ["Sage couldn't find your organization's context."],
    org: null,
    user: null,
    userId, 
    orgId,
  };
}

/**
 * Logs error details for context building failures
 * 
 * @param error - The error that occurred
 * @param userId - User ID for logging context
 * @param orgId - Organization ID for logging context
 */
export function logContextBuildingError(error: unknown, userId?: string, orgId?: string) {
  console.error("Error building context:", error, { userId, orgId });
}
