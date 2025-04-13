
// src/lib/buildSageContext.ts

import { fetchOrgContext } from '@/lib/fetchOrgContext';
import { fetchUserContext } from '@/lib/fetchUserContext';

/**
 * Constructs the full context for Sage based on the user and org.
 *
 * @param userId - ID of the current user
 * @param orgId - ID of the user's organization
 * @returns Enriched context object Sage will use
 */
export async function buildSageContext(userId: string, orgId: string) {
  console.log("🔍 Building context for userId:", userId, "and orgId:", orgId);
  
  if (!userId || !orgId) {
    console.error("Missing userId or orgId:", { userId, orgId });
    throw new Error("Missing userId or orgId");
  }

  try {
    const [orgContext, userContext] = await Promise.all([
      fetchOrgContext(orgId),
      fetchUserContext(userId),
    ]);

    console.log("✅ Context fetched:", { 
      orgContextExists: !!orgContext, 
      userContextExists: !!userContext 
    });

    // Defensive logging for incomplete org context
    if (orgContext && !orgContext.name) {
      console.warn("⚠️ Incomplete org context: Missing name field", { 
        orgId, 
        userId,
        orgFields: Object.keys(orgContext || {})
      });
    }

    // Defensive logging for incomplete user context
    if (userContext && !userContext.role) {
      console.warn("⚠️ Incomplete user context: Missing role field", { 
        userId, 
        orgId,
        userFields: Object.keys(userContext || {})
      });
    }

    if (!orgContext) {
      console.warn("No organization context found for orgId:", orgId);
      return {
        messages: ["Sage couldn't find your organization's context."],
        context: { userId, orgId },
      };
    }

    return {
      messages: [],
      context: {
        org: orgContext,
        user: userContext,
        userId,
        orgId,
      },
    };
  } catch (error) {
    console.error("Error building context:", error);
    throw error;
  }
}
