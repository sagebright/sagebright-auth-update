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
  const [orgContext, userContext] = await Promise.all([
    fetchOrgContext(orgId),
    fetchUserContext(userId),
  ]);

  if (!orgContext) {
    return {
      messages: [`Sage couldn't find your organization's context.`],
      context: {},
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
}
