
import { contextLogger } from '../contextLogger';
import { createUserContextFallback } from '../sageContextFallbacks';
import { fetchAuth } from '@/lib/backendAuth';

/**
 * Fetches user context data with central auth endpoint
 * No direct Supabase dependency
 */
export async function fetchUserContextData(
  userId: string, 
  currentUserData: any | null
): Promise<{ userContext: any; userContextSource: string }> {
  let userContext = null;
  let userContextSource = 'none';
  
  // If we already have user data, use it directly
  if (currentUserData) {
    contextLogger.info("Using pre-fetched user data");
    return { userContext: currentUserData, userContextSource: 'pre-fetched' };
  }
  
  // Try to get user context from central auth endpoint
  try {
    contextLogger.info(`Fetching user context from backend for userId: ${userId}`);
    const authData = await fetchAuth();
    
    if (authData && authData.user) {
      userContext = {
        id: authData.user.id,
        role: authData.user.role,
        // Add any other fields needed for your context
      };
      
      userContextSource = 'backend-auth';
      contextLogger.success("User context found from backend auth", { 
        userId: authData.user.id,
        fields: Object.keys(userContext).length 
      });
    } else {
      contextLogger.warn("No user context found from backend auth");
    }
  } catch (error) {
    contextLogger.error("Error in backend auth user context fetch:", error);
  }
  
  // Use fallbacks if needed in development
  if (!userContext && process.env.NODE_ENV === 'development') {
    contextLogger.info("Using fallback user context for development");
    userContext = createUserContextFallback(userId, currentUserData);
    userContextSource = 'fallback';
  }
  
  return { userContext, userContextSource };
}
