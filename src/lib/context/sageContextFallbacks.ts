
/**
 * Utilities for creating fallback context data when production data is not available
 */

/**
 * Creates a fallback user context object
 */
export function createUserContextFallback(userId: string, currentUserData: any | null, source = 'dev-fallback') {
  return {
    id: userId,
    user_id: userId,
    name: currentUserData?.full_name || "Development User",
    email: currentUserData?.email || "dev@example.com",
    role: currentUserData?.role || "user",
    department: "Engineering (Dev Fallback)",
    manager_name: "Dev Manager",
    learning_style: "Visual",
    timezone: "UTC-8",
    start_date: "2023-01-01",
    source
  };
}

/**
 * Creates a fallback organization context object
 */
export function createOrgContextFallback(orgId: string, source = 'dev-fallback') {
  return {
    id: orgId,
    orgId: orgId,
    name: "Development Organization",
    mission: "This is a development environment",
    values: ["Learning", "Testing", "Developing"],
    tools_and_systems: "Development toolkit",
    executives: [{ name: "Dev Lead", role: "CTO" }],
    source
  };
}

/**
 * Creates a fallback context object for error recovery
 */
export function createErrorFallbackContext(error: any, userId: string, orgId: string) {
  return {
    messages: ["Error building context - development fallback activated"],
    org: {
      id: orgId || 'dev-fallback-id', 
      orgId: orgId || 'dev-fallback-id',
      name: "Error Recovery Organization",
      mission: "Development mission - error recovery mode",
      values: ["Resilience", "Error handling"],
      tools_and_systems: "Basic development tools",
      source: 'error-fallback'
    },
    user: {
      id: userId || 'dev-fallback-id',
      user_id: userId || 'dev-fallback-id',
      name: "Error Recovery User",
      role: "user",
      department: "Error Recovery Department",
      manager_name: "Error Recovery Manager",
      learning_style: "Visual",
      timezone: "UTC",
      source: 'error-fallback'
    },
    userId: userId || 'dev-fallback-id',
    orgId: orgId || 'dev-fallback-id',
    _meta: {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorTimestamp: new Date().toISOString(),
      recoveryType: 'dev-mode-fallback'
    }
  };
}
