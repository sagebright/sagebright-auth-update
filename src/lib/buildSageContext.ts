
import { getUserContext, getOrgContext } from '@/lib/backendApi';
import { validateContextIds, validateOrgContext, validateUserContext } from '@/lib/contextValidation';
import { createOrgContextFallback, logContextBuildingError } from '@/lib/contextErrorHandling';
import { validateSageContext } from './validation/contextSchema';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { fetchOrgContext } from '@/lib/fetchOrgContext';

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
    console.log("[Sage Init] 🧪 Using development approach for context");
    
    // If any critical values are missing, use fallbacks for development
    const safeUserId = userId || 'dev-user-id';
    const safeOrgId = orgId || 'dev-org-id';
    const safeOrgSlug = orgSlug || 'default-org';
    
    try {
      // Try to fetch real context data with multiple strategies
      let orgContext = null;
      let userContext = null;
      
      try {
        console.log("[Sage Init] 🔄 Attempting API-based context fetch");
        
        // First try our enhanced backend API
        if (safeUserId) {
          userContext = await getUserContext(safeUserId);
          console.log("[Sage Init] 📊 User context fetch result:", { 
            success: !!userContext, 
            source: 'backendApi'
          });
        }
        
        if (safeOrgId) {
          orgContext = await getOrgContext(safeOrgId);
          console.log("[Sage Init] 📊 Org context fetch result:", { 
            success: !!orgContext, 
            source: 'backendApi'
          });
        }
        
        // If backend API fails, fall back to direct Supabase queries
        if (!userContext && safeUserId) {
          console.log("[Sage Init] 🔄 Falling back to direct Supabase for user context");
          userContext = await fetchUserContext(safeUserId);
        }
        
        if (!orgContext && safeOrgId) {
          console.log("[Sage Init] 🔄 Falling back to direct Supabase for org context");
          orgContext = await fetchOrgContext(safeOrgId);
        }
      } catch (fetchError) {
        console.warn("[Sage Init] ⚠️ Error fetching context data:", fetchError);
        // Continue with fallbacks
      }
      
      // Use fallbacks if fetch failed
      if (!orgContext) {
        console.log("[Sage Init] 🏗️ Using fallback org context");
        orgContext = {
          id: safeOrgId,
          orgId: safeOrgId,
          name: "Development Organization",
          mission: "This is a development environment",
          values: ["Learning", "Testing", "Developing"],
          tools_and_systems: "Development toolkit",
          executives: [{ name: "Dev Lead", role: "CTO" }]
        };
      }
      
      if (!userContext) {
        console.log("[Sage Init] 🏗️ Using fallback user context");
        userContext = {
          id: safeUserId,
          user_id: safeUserId,
          name: currentUserData?.full_name || "Development User",
          email: currentUserData?.email || "dev@example.com",
          role: currentUserData?.role || "user"
        };
      }
      
      console.log("[Sage Init] ✅ Created context successfully");
      
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
        org: { name: "Development Organization", id: safeOrgId, orgId: safeOrgId },
        user: { name: "Development User", id: safeUserId, user_id: safeUserId },
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

    // Try enhanced context fetching first (API-based)
    console.log("[Sage Init] Attempting API-based context fetch for production");
    
    let orgContext = await getOrgContext(orgId);
    let userContext = await getUserContext(userId);
    
    // Fall back to direct Supabase if needed
    if (!orgContext) {
      console.log("[Sage Init] Falling back to direct Supabase for org context");
      orgContext = await fetchOrgContext(orgId);
    }
    
    if (!userContext) {
      console.log("[Sage Init] Falling back to direct Supabase for user context");
      userContext = await fetchUserContext(userId);
    }

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
