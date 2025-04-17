
import { contextLogger } from '../contextLogger';
import { createOrgContextFallback } from '../sageContextFallbacks';
import { fetchAuth } from '@/lib/backendAuth';

export async function fetchOrgContextData(
  orgId: string
): Promise<{ orgContext: any; orgContextSource: string }> {
  let orgContext = null;
  let orgContextSource = 'none';
  
  try {
    contextLogger.info(`Fetching org context from backend for orgId: ${orgId}`);
    const authData = await fetchAuth();
    
    if (authData && authData.org) {
      orgContext = {
        id: authData.org.id,
        slug: authData.org.slug
      };
      
      orgContextSource = 'backend-auth';
      contextLogger.success("Org context found from backend auth", { 
        orgId: authData.org.id,
        slug: authData.org.slug
      });
    } else {
      contextLogger.warn("No org context found from backend auth");
    }
  } catch (error) {
    contextLogger.error("Error in backend auth org context fetch:", error);
  }
  
  if (!orgContext && process.env.NODE_ENV === 'development') {
    contextLogger.info("Using fallback org context for development");
    orgContext = createOrgContextFallback(orgId);
    orgContextSource = 'fallback';
  }
  
  return { orgContext, orgContextSource };
}
