
/**
 * Validation utilities for context data
 */
import { validateContextIdentifiers } from './validation/contextSchema';

export function validateContextIds(userId: string, orgId: string) {
  try {
    return validateContextIdentifiers(userId, orgId);
  } catch (error) {
    // Re-throw with more specific error message for the application context
    if (error instanceof Error) {
      throw new Error(`Invalid context identifiers: ${error.message}`);
    }
    throw error;
  }
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
