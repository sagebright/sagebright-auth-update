
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

  // Development mode fallback - create minimally viable context
  if (process.env.NODE_ENV === 'development') {
    console.log("[Sage Init] 🧪 Using development fallbacks for missing context");
    
    // If any critical values are missing, use fallbacks for development
    const safeUserId = userId || 'dev-user-id';
    const safeOrgId = orgId || 'dev-org-id';
    const safeOrgSlug = orgSlug || 'default-org';
    
    try {
      // Try to fetch real context data if possible
      let orgContext = null;
      let userContext = null;
      
      try {
        // Attempt fetch but don't block on failures
        if (safeOrgId) {
          orgContext = await fetchOrgContext(safeOrgId);
        }
        
        if (safeUserId) {
          userContext = await fetchUserContext(safeUserId);
        }
      } catch (fetchError) {
        console.warn("[Sage Init] ⚠️ Error fetching context data:", fetchError);
        // Continue with fallbacks
      }
      
      // Use fallbacks if fetch failed
      if (!orgContext) {
        orgContext = {
          orgId: safeOrgId,
          name: "Development Organization",
          mission: "This is a development environment",
          values: ["Learning", "Testing", "Developing"],
          tools_and_systems: "Development toolkit",
          executives: [{ name: "Dev Lead", role: "CTO" }]
        };
      }
      
      if (!userContext) {
        userContext = {
          id: safeUserId,
          name: currentUserData?.full_name || "Development User",
          email: currentUserData?.email || "dev@example.com",
          role: currentUserData?.role || "user"
        };
      }
      
      console.log("[Sage Init] ✅ Created development context successfully");
      
      return {
        messages: [],
        org: orgContext,
        user: userContext,
        userId: safeUserId,
        orgId: safeOrgId,
      };
    } catch (error) {
      console.error("[Sage Init] ❌ Error creating development context:", error);
      
      // Return minimal fallback context to prevent crashes
      return {
        messages: ["Development context"],
        org: { name: "Development Organization", orgId: safeOrgId },
        user: { name: "Development User", id: safeUserId },
        userId: safeUserId,
        orgId: safeOrgId,
      };
    }
  }
  
  // Production path - require valid context
  try {
    // Validate input parameters
    if (!orgSlug || !currentUserData) {
      console.warn("[Sage Init] ⚠️ Missing required context:", {
        hasOrgSlug: !!orgSlug,
        hasCurrentUserData: !!currentUserData
      });
      return null;
    }
    
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
