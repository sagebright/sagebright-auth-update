
/**
 * Core types for Sage context readiness
 */

export interface SageContextReadiness {
  // Core readiness flags
  isOrgReady: boolean;
  isSessionReady: boolean;
  isVoiceReady: boolean;
  isReadyToRender: boolean;
  
  // Session stability flag - true only when all auth components are stable
  isSessionStable: boolean;
  
  // Backward compatibility properties
  isContextReady: boolean;
  contextCheckComplete: boolean;
  missingContext: boolean;
  
  // Timestamp when fully ready (null if not ready)
  readySince: number | null;
  
  // Human-readable blockers
  blockers: string[];
}

// Type for individual readiness check results
export interface ReadinessCheck {
  isReady: boolean;
  blockers: string[];
}
