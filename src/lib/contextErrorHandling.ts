
/**
 * Utilities for handling context-building errors
 */

export function createOrgContextFallback(orgId: string) {
  return {
    id: orgId,
    name: "Default Organization",
    mission: "This is a fallback context",
    values: ["Resilience", "Adaptability", "Problem-solving"],
    onboarding_processes: "Standard onboarding",
    tools_and_systems: "Core systems",
    glossary: {},
    policies: {},
    known_pain_points: [],
    learning_culture: "Continuous improvement",
    leadership_style: "Adaptive",
    executives: [],
    history: "Organization created with fallback context",
    culture: "Collaborative"
  };
}

export function logContextBuildingError(error: any, userId: string, orgId: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : '';
  
  console.error("❌ Error building context:", {
    message: errorMessage,
    userId,
    orgId,
    stack: errorStack,
    timestamp: new Date().toISOString()
  });
}
