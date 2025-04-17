
import { contextLogger } from './contextLogger';
import { validateContextIds } from './contextValidation';
import { createErrorFallbackContext } from './sageContextFallbacks';
import { fetchContextViaApi } from './fetchers/apiFetcher';
import { buildContextFromFetched } from './builders/contextBuilder';

/**
 * Constructs the full context for Sage based on the user and org.
 * This is the central function responsible for context hydration.
 * Enhanced with improved error handling and fallback mechanisms.
 */
export async function buildSageContext(
  userId: string, 
  orgId: string,
  orgSlug: string | null,
  currentUserData: any | null
) {
  console.log("🔥 buildSageContext invoked", { userId, orgId, orgSlug, hasUserData: !!currentUserData });
  
  // Log detailed context state
  contextLogger.info("Starting buildSageContext", {
    userId,
    orgId,
    orgSlug,
    hasCurrentUserData: !!currentUserData,
    timestamp: new Date().toISOString()
  });

  try {
    // First try using the standardized API endpoint
    const apiContext = await fetchContextViaApi(userId, orgId, orgSlug);
    if (apiContext) {
      return apiContext;
    }

    // Fallback to the legacy direct fetch approach
    // Ensure we have the basic requirements
    if (!userId || !orgId) {
      throw new Error("Missing essential IDs for context building");
    }
    
    // Build context from fetched data
    return await buildContextFromFetched(userId, orgId, currentUserData);
  } catch (error) {
    contextLogger.error("Error building context", { error, userId, orgId });
    
    // In development, provide a fallback context to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      return createErrorFallbackContext(error, userId, orgId);
    }
    
    // In production, return a minimal error structure
    return {
      messages: ["Error building context"],
      org: null,
      user: null,
      userId: userId || '',
      orgId: orgId || '',
      _meta: {
        error: 'Context build failure',
        timestamp: new Date().toISOString()
      }
    };
  }
}
