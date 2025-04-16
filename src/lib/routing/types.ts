
import { z } from 'zod';

// Validated Route Definitions
export const RouteSchema = z.object({
  path: z.string(),
  requiredRole: z.enum(['user', 'admin', 'guest']).optional(),
  requiresAuth: z.boolean(),
  parameterSchema: z.record(z.string()).optional()
});

// Type Inference from Schema
export type Route = z.infer<typeof RouteSchema>;

// Explicit Route Definitions
export const ROUTES = {
  ROOT: { 
    path: '/', 
    requiresAuth: false 
  },
  LOGIN: { 
    path: '/auth/login', 
    requiresAuth: false 
  },
  USER_DASHBOARD: { 
    path: '/user-dashboard', 
    requiresAuth: true,
    requiredRole: 'user'
  },
  ADMIN_DASHBOARD: { 
    path: '/hr-dashboard', 
    requiresAuth: true,
    requiredRole: 'admin'
  },
  ASK_SAGE: { 
    path: '/ask-sage', 
    requiresAuth: true,
    requiredRole: 'user',
    parameterSchema: {
      voice: z.string().optional()
    }
  }
} as const;

// Utility type for extracting keys from ROUTES
export type RouteName = keyof typeof ROUTES;

// Redirect Intent Contract
export interface RedirectIntent {
  to: RouteName;
  params?: Record<string, string>;
  reason?: 'auth' | 'role' | 'default' | 'user-initiated';
}

// Validation Function for Redirect Intents
export function validateRedirectIntent(intent: RedirectIntent): boolean {
  const route = ROUTES[intent.to];
  
  // Basic validation checks
  if (!route) return false;
  
  // Optional parameter validation if route defines a parameter schema
  // We need to check if parameterSchema exists on the route first
  if (intent.params && 'parameterSchema' in route && route.parameterSchema) {
    try {
      // Create a dynamic schema based on the route's parameterSchema
      const paramSchema = z.object(
        Object.fromEntries(
          Object.entries(route.parameterSchema).map(([key, validator]) => [key, validator])
        )
      );
      
      // Validate the params against the schema
      paramSchema.parse(intent.params);
    } catch {
      return false;
    }
  }
  
  return true;
}
