
/**
 * Schema validation for Sage context
 */

// Simple validation for now - can be expanded to use Zod later
export function validateSageContext(context: any) {
  // In development mode, be permissive
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development mode: Skipping strict schema validation');
    return true;
  }
  
  // Basic validation
  if (!context) {
    throw new Error('Context is null or undefined');
  }
  
  // Check essential properties
  if (!context.userId) {
    throw new Error('Context is missing userId');
  }
  
  if (!context.orgId) {
    throw new Error('Context is missing orgId');
  }
  
  // Check nested objects
  if (!context.org) {
    throw new Error('Context is missing org data');
  }
  
  if (!context.user) {
    throw new Error('Context is missing user data');
  }
  
  return true;
}
