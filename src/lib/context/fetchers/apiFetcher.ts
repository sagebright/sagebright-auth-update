
import { contextLogger } from '../contextLogger';
import { hydrateSageContext } from '../../api/sageContextApi';
import { API_BASE_URL } from '../../constants';

/**
 * Attempts to fetch context via the unified API endpoint
 */
export async function fetchContextViaApi(
  userId: string, 
  orgId: string, 
  orgSlug: string | null
): Promise<any | null> {
  try {
    contextLogger.info("Attempting to fetch context via unified API endpoint");
    const apiContext = await hydrateSageContext(userId, orgId, orgSlug);
    
    if (apiContext) {
      contextLogger.success("Successfully fetched context from API", {
        source: 'api',
        hasUser: !!apiContext.user,
        hasOrg: !!apiContext.org
      });
      
      return {
        messages: [],
        org: apiContext.org,
        user: apiContext.user,
        userId,
        orgId,
        _meta: {
          source: 'api',
          hydratedAt: new Date().toISOString()
        }
      };
    } else {
      contextLogger.warn("API context fetch returned null, falling back to direct methods");
      return null;
    }
  } catch (apiError) {
    contextLogger.error("Error fetching context from API, falling back to direct methods", apiError);
    return null;
  }
}
