
// src/lib/buildSageContext.ts

import { fetchOrgContext } from '@/lib/fetchOrgContext';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { validateContextIds, validateOrgContext, validateUserContext } from '@/lib/contextValidation';
import { createOrgContextFallback, logContextBuildingError } from '@/lib/contextErrorHandling';

/**
 * Constructs the full context for Sage based on the user and org.
 *
 * @param userId - ID of the current user
 * @param orgId - ID of the user's organization
 * @returns Enriched context object Sage will use
 */
export async function buildSageContext(userId: string, orgId: string) {
  console.log("🔍 Building context for userId:", userId, "and orgId:", orgId);
  
  try {
    // Validate input parameters
    validateContextIds(userId, orgId);

    // Fetch context data
    const [orgContext, userContext] = await Promise.all([
      fetchOrgContext(orgId),
      fetchUserContext(userId),
    ]);

    console.log("✅ Context fetched:", { 
      orgContextExists: !!orgContext, 
      userContextExists: !!userContext 
    });

    // Validate organization context
    if (!validateOrgContext(orgContext, orgId)) {
      return {
        messages: [],
        org: null,
        user: null,
        userId,
        orgId,
      };
    }

    // Validate user context (logged but not blocking)
    validateUserContext(userContext, userId, orgId);

    return {
      messages: [],
      org: orgContext,
      user: userContext,
      userId,
      orgId,
    };
  } catch (error) {
    logContextBuildingError(error, userId, orgId);
    
    // Return a consistent structure even in error cases
    return {
      messages: ["Error building context"],
      org: null,
      user: null,
      userId,
      orgId,
    };
  }
}
