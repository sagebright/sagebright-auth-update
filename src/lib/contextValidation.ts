
/**
 * Utilities for validating context data for Sage
 */

/**
 * Validates that required user ID and org ID are present
 * 
 * @param userId - User ID to validate
 * @param orgId - Organization ID to validate
 * @returns True if both IDs are valid, throws an error otherwise
 */
export function validateContextIds(userId: string | null | undefined, orgId: string | null | undefined): boolean {
  if (!userId) {
    console.error("Missing userId for context building");
    throw new Error("Missing userId");
  }
  
  if (!orgId) {
    console.error("Missing orgId for context building");
    throw new Error("Missing orgId");
  }
  
  return true;
}

/**
 * Validates organization context data to ensure critical fields are present
 * 
 * @param orgContext - The organization context object
 * @param orgId - Organization ID for logging purposes
 * @returns True if context is valid, false if critical fields are missing
 */
export function validateOrgContext(orgContext: any, orgId: string): boolean {
  if (!orgContext) {
    console.warn(`⚠️ No organization context found for orgId: ${orgId}`);
    return false;
  }
  
  if (!orgContext.name) {
    console.warn("⚠️ Incomplete org context: Missing name field", { 
      orgId,
      orgFields: Object.keys(orgContext || {})
    });
    return false;
  }
  
  return true;
}

/**
 * Validates user context data to ensure critical fields are present
 * 
 * @param userContext - The user context object 
 * @param userId - User ID for logging purposes
 * @param orgId - Organization ID for logging purposes
 * @returns True if context is valid, false if critical fields are missing
 */
export function validateUserContext(userContext: any, userId: string, orgId: string): boolean {
  if (!userContext) {
    console.warn(`⚠️ No user context found for userId: ${userId}`);
    return false;
  }
  
  if (!userContext.role) {
    console.warn("⚠️ Incomplete user context: Missing role field", { 
      userId, 
      orgId,
      userFields: Object.keys(userContext || {})
    });
    return false;
  }
  
  return true;
}
