
import { getUserContext, getOrgContext } from '@/lib/backendApi';
import { validateContextIds, validateOrgContext, validateUserContext } from '@/lib/contextValidation';
import { createOrgContextFallback, logContextBuildingError } from '@/lib/contextErrorHandling';
import { validateSageContext } from './validation/contextSchema';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { fetchOrgContext } from '@/lib/fetchOrgContext';

/**
 * Constructs the full context for Sage based on the user and org.
 * This is the central function responsible for context hydration.
 *
 * @param userId - ID of the current user
 * @param orgId - ID of the user's organization 
 * @param orgSlug - Slug of the organization
 * @param currentUserData - Full user data object
 * @returns Enriched context object Sage will use
 */
export async function buildSageContext(
  userId: string, 
  orgId: string,
  orgSlug: string | null,
  currentUserData: any | null
) {
  // Log detailed context state
  console.log("[Sage Init] Starting buildSageContext with:", {
    userId,
    orgId,
    orgSlug,
    hasCurrentUserData: !!currentUserData,
    timestamp: new Date().toISOString()
  });

  try {
    // Use a consistent approach for all environments for more predictable behavior
    console.log("[Sage Init] Starting context hydration process");
    
    // Use these variables to track where the context came from for debugging
    let userContextSource = 'none';
    let orgContextSource = 'none';
    
    // Ensure we have the basic requirements
    if (!userId || !orgId) {
      throw new Error("Missing essential IDs for context building");
    }
    
    validateContextIds(userId, orgId);
    
    // Initialize context containers
    let orgContext = null;
    let userContext = null;
    
    // Multi-layered approach: try all available methods to get context data
    // First, try to get user context
    try {
      userContext = await fetchUserContext(userId);
      if (userContext) {
        userContextSource = 'direct-supabase';
        console.log("[Sage Init] ✅ User context found from direct Supabase");
      }
    } catch (error) {
      console.log("[Sage Init] ⚠️ Error in direct Supabase user context fetch:", error);
    }
    
    // Next, try to get org context
    try {
      orgContext = await fetchOrgContext(orgId);
      if (orgContext) {
        orgContextSource = 'direct-supabase';
        console.log("[Sage Init] ✅ Org context found from direct Supabase");
      }
    } catch (error) {
      console.log("[Sage Init] ⚠️ Error in direct Supabase org context fetch:", error);
    }
    
    // If still missing contexts, create fallbacks in development
    if (process.env.NODE_ENV === 'development') {
      // User context fallback for development
      if (!userContext) {
        console.log("[Sage Init] 🏗️ Using fallback user context for development");
        userContext = {
          id: userId,
          user_id: userId,
          name: currentUserData?.full_name || "Development User",
          email: currentUserData?.email || "dev@example.com",
          role: currentUserData?.role || "user",
          source: 'dev-fallback'
        };
        userContextSource = 'fallback';
      }
      
      // Org context fallback for development
      if (!orgContext) {
        console.log("[Sage Init] 🏗️ Using fallback org context for development");
        orgContext = {
          id: orgId,
          orgId: orgId,
          name: "Development Organization",
          mission: "This is a development environment",
          values: ["Learning", "Testing", "Developing"],
          tools_and_systems: "Development toolkit",
          executives: [{ name: "Dev Lead", role: "CTO" }],
          source: 'dev-fallback'
        };
        orgContextSource = 'fallback';
      }
    }
    
    // Final validation check
    if (!orgContext || !userContext) {
      if (process.env.NODE_ENV === 'production') {
        // In production, we need real context data
        console.error("[Sage Init] ❌ Could not retrieve required context data.");
        throw new Error("Required context data is missing");
      } else {
        console.warn("[Sage Init] ⚠️ Using minimal fallbacks for missing context data");
        // Final fallbacks if somehow everything failed in development
        if (!userContext) {
          userContext = { 
            id: userId, 
            user_id: userId, 
            name: "Emergency Fallback User" 
          };
          userContextSource = 'emergency-fallback';
        }
        if (!orgContext) {
          orgContext = { 
            id: orgId, 
            orgId: orgId, 
            name: "Emergency Fallback Organization" 
          };
          orgContextSource = 'emergency-fallback';
        }
      }
    }
    
    // Construct the context object with the collected data
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

    console.log("[Sage Init] ✅ Context successfully built from sources:", {
      userContextSource,
      orgContextSource
    });

    // Validate the constructed context but don't break execution
    try {
      validateSageContext(context);
      console.log("✅ Context validated successfully");
    } catch (validationError) {
      console.warn("⚠️ Built context failed validation", validationError);
    }

    return context;
  } catch (error) {
    logContextBuildingError(error, userId, orgId);
    
    // In development, provide a fallback context to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      return {
        messages: ["Error building context - development fallback activated"],
        org: {
          id: orgId || 'dev-fallback-id', 
          orgId: orgId || 'dev-fallback-id',
          name: "Error Recovery Organization",
          source: 'error-fallback'
        },
        user: {
          id: userId || 'dev-fallback-id',
          user_id: userId || 'dev-fallback-id',
          name: "Error Recovery User",
          source: 'error-fallback'
        },
        userId: userId || 'dev-fallback-id',
        orgId: orgId || 'dev-fallback-id',
        _meta: {
          error: error instanceof Error ? error.message : 'Unknown error',
          errorTimestamp: new Date().toISOString(),
          recoveryType: 'dev-mode-fallback'
        }
      };
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
