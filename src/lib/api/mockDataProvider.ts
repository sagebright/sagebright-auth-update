
/**
 * Mock data provider for development environment
 */
import { ApiResponse } from './types';

/**
 * Returns appropriate mock data based on endpoint
 * Centralizes all mock responses for better maintenance
 */
export function getMockResponseForEndpoint(endpoint: string): ApiResponse {
  console.log(`🧪 Providing mock data for ${endpoint}`);
  
  // User context endpoints
  if (endpoint.includes('/user/context')) {
    const userId = endpoint.includes('userId=') ? endpoint.split('userId=')[1].split('&')[0] : 'mock-user-id';
    
    return {
      ok: true,
      status: 200,
      data: {
        id: 'mock-user-context-id',
        user_id: userId,
        org_id: 'mock-org-id',
        role: 'user',
        department: 'Engineering',
        manager_name: 'Dev Manager',
        learning_style: 'Visual',
        timezone: 'UTC-8',
        start_date: '2023-01-01',
        source: 'api-mock'
      }
    };
  }
  
  // Org context endpoints
  if (endpoint.includes('/org/context')) {
    const orgId = endpoint.includes('orgId=') ? endpoint.split('orgId=')[1].split('&')[0] : 'mock-org-id';
    
    return {
      ok: true,
      status: 200,
      data: {
        id: 'mock-org-context-id',
        orgId: orgId,
        name: "Development Organization",
        mission: "This is a development environment",
        values: ["Learning", "Testing", "Developing"],
        tools_and_systems: "Development toolkit",
        executives: [{ name: "Dev Lead", role: "CTO" }],
        source: 'api-mock'
      }
    };
  }
  
  // Unified context endpoint (new)
  if (endpoint.includes('/api/context/sage')) {
    return {
      ok: true,
      status: 200,
      data: {
        user: {
          id: 'mock-user-context-id',
          user_id: 'mock-user-id',
          role: 'user',
          department: 'Engineering',
          learning_style: 'Visual',
          source: 'api-mock'
        },
        org: {
          id: 'mock-org-context-id',
          name: "Development Organization",
          mission: "This is a development environment",
          values: ["Learning", "Testing", "Developing"],
          source: 'api-mock'
        }
      }
    };
  }
  
  // Users list endpoint (deprecated)
  if (endpoint === '/users') {
    console.warn('⚠️ Deprecated route /users accessed. Use /api/context/sage instead.');
    return {
      ok: true,
      status: 200,
      data: [
        { 
          id: 'mock-user-1', 
          name: 'Development User', 
          email: 'dev@example.com', 
          role: 'admin',
          source: 'deprecated-mock'
        },
      ]
    };
  }
  
  // Departments endpoint (deprecated)
  if (endpoint === '/departments') {
    console.warn('⚠️ Deprecated route /departments accessed.');
    return {
      ok: true,
      status: 200,
      data: [
        { id: 'dept-1', name: 'Engineering' },
        { id: 'dept-2', name: 'Sales' },
        { id: 'dept-3', name: 'Marketing' }
      ]
    };
  }
  
  // Roadmaps endpoint (deprecated)
  if (endpoint === '/roadmaps') {
    console.warn('⚠️ Deprecated route /roadmaps accessed.');
    return {
      ok: true,
      status: 200,
      data: [
        { id: 'rm-1', name: 'Q2 Development Plan', progress: 65 },
        { id: 'rm-2', name: 'Annual Strategy', progress: 30 }
      ]
    };
  }
  
  // Fallback for any other endpoint
  return {
    ok: true,
    status: 200,
    data: {
      message: 'Mock data for development',
      endpoint,
      warning: 'This endpoint may not exist in production',
      source: 'generic-mock'
    }
  };
}
