
import { contextLogger } from '../contextLogger';
import { fetchOrgContext } from '../../fetchOrgContext';
import { createOrgContextFallback } from '../sageContextFallbacks';

/**
 * Fetches organization context data with fallback handling
 */
export async function fetchOrgContextData(
  orgId: string
): Promise<{ orgContext: any; orgContextSource: string }> {
  let orgContext = null;
  let orgContextSource = 'none';
  
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
  if (!orgContext && process.env.NODE_ENV === 'development') {
    contextLogger.info("Using fallback org context for development");
    orgContext = createOrgContextFallback(orgId);
    orgContextSource = 'fallback';
  }
  
  return { orgContext, orgContextSource };
}
