
import { contextLogger } from '../contextLogger';
import { createErrorFallbackContext } from '../sageContextFallbacks';
import { validateSageContext } from '../../validation/contextSchema';
import { fetchUserContextData } from '../fetchers/userContextFetcher';
import { fetchOrgContextData } from '../fetchers/orgContextFetcher';

/**
 * Builds a context object from fetched user and org data
 */
export async function buildContextFromFetched(
  userId: string, 
  orgId: string, 
  currentUserData: any | null
) {
  // Fetch user context
  const { userContext, userContextSource } = await fetchUserContextData(userId, currentUserData);
  
  // Fetch org context
  const { orgContext, orgContextSource } = await fetchOrgContextData(orgId);
  
  // Final validation check
  if (!orgContext || !userContext) {
    if (process.env.NODE_ENV === 'production') {
      // In production, we need real context data
      contextLogger.error("Could not retrieve required context data.");
      throw new Error("Required context data is missing");
    } else {
      contextLogger.warn("Using minimal fallbacks for missing context data");
      // Final fallbacks if somehow everything failed in development
      if (!userContext) {
        const { userContext: emergencyUser, userContextSource: emergencyUserSource } = 
          await createEmergencyUserContext(userId, currentUserData);
        return buildFinalContext(
          emergencyUser, 
          orgContext || await createEmergencyOrgContext(orgId), 
          userId, 
          orgId, 
          emergencyUserSource, 
          orgContext ? orgContextSource : 'emergency-fallback'
        );
      }
      if (!orgContext) {
        const { orgContext: emergencyOrg } = await createEmergencyOrgContext(orgId);
        return buildFinalContext(
          userContext, 
          emergencyOrg, 
          userId, 
          orgId, 
          userContextSource, 
          'emergency-fallback'
        );
      }
    }
  }
  
  // Build the final context
  return buildFinalContext(userContext, orgContext, userId, orgId, userContextSource, orgContextSource);
}

/**
 * Creates an emergency user context when all else fails (dev only)
 */
async function createEmergencyUserContext(userId: string, currentUserData: any | null) {
  const { createUserContextFallback } = await import('../sageContextFallbacks');
  const userContext = createUserContextFallback(userId, currentUserData, 'emergency-fallback');
  return { userContext, userContextSource: 'emergency-fallback' };
}

/**
 * Creates an emergency org context when all else fails (dev only)
 */
async function createEmergencyOrgContext(orgId: string) {
  const { createOrgContextFallback } = await import('../sageContextFallbacks');
  const orgContext = createOrgContextFallback(orgId, 'emergency-fallback');
  return { orgContext, orgContextSource: 'emergency-fallback' };
}

/**
 * Builds the final context object with metadata
 */
function buildFinalContext(
  userContext: any, 
  orgContext: any, 
  userId: string, 
  orgId: string, 
  userContextSource: string, 
  orgContextSource: string
) {
  const context = {
    messages: [],
    org: orgContext,
    user: userContext,
    userId,
    orgId,
    _meta: {
      userContextSource,
      orgContextSource,
      hydratedAt: new Date().toISOString()
    }
  };

  contextLogger.success("Context successfully built from sources:", {
    userContextSource,
    orgContextSource,
    userContextFields: userContext ? Object.keys(userContext).length : 0,
    orgContextFields: orgContext ? Object.keys(orgContext).length : 0
  });

  // Validate the constructed context but don't break execution
  try {
    validateSageContext(context);
    contextLogger.success("Context validated successfully");
  } catch (validationError) {
    contextLogger.warn("Built context failed validation", validationError);
  }

  return context;
}
