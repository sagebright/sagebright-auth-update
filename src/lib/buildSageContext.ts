
// src/lib/buildSageContext.ts

import { fetchOrgContext } from '@/lib/fetchOrgContext';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { validateContextIds, validateOrgContext, validateUserContext } from '@/lib/contextValidation';
import { createOrgContextFallback, logContextBuildingError } from '@/lib/contextErrorHandling';
import { validateSageContext } from './validation/contextSchema';

/**
 * Constructs the full context for Sage based on the user and org.
 *
 * @param userId - ID of the current user
 * @param orgId - ID of the user's organization
 * @returns Enriched context object Sage will use
 */
export async function buildSageContext(userId: string, orgId: string) {
  console.log("[Sage Init] Starting buildSageContext with:", {
    userId,
    orgId,
    timestamp: new Date().toISOString()
  });
  
  try {
    // Validate input parameters
    validateContextIds(userId, orgId);

    // Fetch real context data from Supabase
    const [orgContext, userContext] = await Promise.all([
      fetchOrgContext(orgId),
      fetchUserContext(userId),
    ]);

    console.log("[Sage Init] Context fetch completed:", { 
      hasOrgContext: !!orgContext, 
      hasUserContext: !!userContext,
      orgId,
      userId
    });

    // Construct the context object with the fetched data
    const context = {
      messages: [],
      org: orgContext,
      user: userContext,
      userId,
      orgId,
    };

    // Validate the constructed context with Zod but don't break execution
    try {
      validateSageContext(context);
      console.log("✅ Context validated successfully");
    } catch (validationError) {
      console.warn("⚠️ Built context failed Zod validation", validationError);
      // We'll continue execution despite validation failure to maintain functionality
      // This helps with debugging without breaking existing flows
    }

    return context;
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
