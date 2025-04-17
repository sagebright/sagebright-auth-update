
/**
 * Validation utilities for context data
 */

export function validateContextIds(userId: string, orgId: string) {
  if (!userId) {
    throw new Error('Missing required userId for context building');
  }
  
  if (!orgId) {
    throw new Error('Missing required orgId for context building');
  }
  
  // Basic format validation if needed
  if (typeof userId !== 'string' || userId.length < 5) {
    throw new Error('Invalid userId format');
  }
  
  if (typeof orgId !== 'string' || orgId.length < 5) {
    throw new Error('Invalid orgId format');
  }
  
  return true;
}

export function validateOrgContext(orgContext: any) {
  if (!orgContext) {
    return false;
  }
  
  // Skip detailed validation in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Check minimum required fields
  if (!orgContext.name) {
    return false;
  }
  
  return true;
}

export function validateUserContext(userContext: any) {
  if (!userContext) {
    return false;
  }
  
  // Skip detailed validation in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Check minimum required fields
  if (!userContext.id) {
    return false;
  }
  
  return true;
}
