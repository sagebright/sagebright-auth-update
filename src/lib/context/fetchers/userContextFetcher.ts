
import { contextLogger } from '../contextLogger';
import { fetchUserContext } from '../../fetchUserContext';
import { createUserContextFallback } from '../sageContextFallbacks';

/**
 * Fetches user context data with fallback handling
 */
export async function fetchUserContextData(
  userId: string, 
  currentUserData: any | null
): Promise<{ userContext: any; userContextSource: string }> {
  let userContext = null;
  let userContextSource = 'none';
  
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
  
  // Use fallbacks if needed in development
  if (!userContext && process.env.NODE_ENV === 'development') {
    contextLogger.info("Using fallback user context for development");
    userContext = createUserContextFallback(userId, currentUserData);
    userContextSource = 'fallback';
  }
  
  return { userContext, userContextSource };
}
