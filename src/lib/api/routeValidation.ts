
/**
 * Route validation utilities for API client
 */

// Define a registry of valid API routes for validation
const VALID_API_ROUTES = [
  '/api/context/sage',
  '/api/context',
  '/api/chat',
  '/api/ask-sage',
  // Add other valid routes here
];

/**
 * Validates if a requested endpoint exists in our API registry
 */
export function isValidApiRoute(endpoint: string): boolean {
  // Consider paths with query params valid if the base path is valid
  const basePath = endpoint.split('?')[0];
  
  // Also consider dynamically generated paths with IDs valid if the pattern exists
  const dynamicPathPattern = basePath.replace(/\/[a-zA-Z0-9-_]+$/, '/:id');
  
  return VALID_API_ROUTES.some(route => 
    basePath === route || 
    dynamicPathPattern === route || 
    route.includes('*')
  );
}
