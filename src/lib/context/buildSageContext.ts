
import { contextLogger } from './contextLogger';
import { validateContextIds } from './contextValidation';
import { createOrgContextFallback, createUserContextFallback, createErrorFallbackContext } from './sageContextFallbacks';
import { fetchUserContext } from '../fetchUserContext';
import { fetchOrgContext } from '../fetchOrgContext';
import { validateSageContext } from '../validation/contextSchema';

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
  // Log detailed context state
  contextLogger.info("Starting buildSageContext", {
    userId,
    orgId,
    orgSlug,
    hasCurrentUserData: !!currentUserData,
    timestamp: new Date().toISOString()
  });

  try {
    // Ensure we have the basic requirements
    if (!userId || !orgId) {
      throw new Error("Missing essential IDs for context building");
    }
    
    // Initialize context containers
    let orgContext = null;
    let userContext = null;
    
    // Track context sources for debugging
    let userContextSource = 'none';
    let orgContextSource = 'none';
    
    // Try to get user context
    try {
      contextLogger.info(`Fetching user context for userId: ${userId}`);
      userContext = await fetchUserContext(userId);
      
      if (userContext) {
        userContextSource = 'direct-supabase';
        contextLogger.success("User context found from direct Supabase", { 
          contextId: userContext.id,
          fields: Object.keys(userContext).length 
        });
      } else {
        contextLogger.warn("No user context found from direct Supabase");
      }
    } catch (error) {
      contextLogger.error("Error in direct Supabase user context fetch:", error);
    }
    
    // Try to get org context
    try {
      contextLogger.info(`Fetching org context for orgId: ${orgId}`);
      orgContext = await fetchOrgContext(orgId);
      
      if (orgContext) {
        orgContextSource = 'direct-supabase';
        contextLogger.success("Org context found from direct Supabase", { 
          contextId: orgContext.id,
          name: orgContext.name,
          fields: Object.keys(orgContext).length 
        });
      } else {
        contextLogger.warn("No org context found from direct Supabase");
      }
    } catch (error) {
      contextLogger.error("Error in direct Supabase org context fetch:", error);
    }
    
    // Use fallbacks if needed in development
    if (process.env.NODE_ENV === 'development') {
      // User context fallback for development
      if (!userContext) {
        contextLogger.info("Using fallback user context for development");
        userContext = createUserContextFallback(userId, currentUserData);
        userContextSource = 'fallback';
      }
      
      // Org context fallback for development
      if (!orgContext) {
        contextLogger.info("Using fallback org context for development");
        orgContext = createOrgContextFallback(orgId);
        orgContextSource = 'fallback';
      }
    }
    
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
          userContext = createUserContextFallback(userId, null, 'emergency-fallback');
          userContextSource = 'emergency-fallback';
        }
        if (!orgContext) {
          orgContext = createOrgContextFallback(orgId, 'emergency-fallback');
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
