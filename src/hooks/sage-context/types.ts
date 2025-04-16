
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
  
  // New: Granular readiness flags for each dependency
  isAuthReady: boolean;
  isUserMetadataReady: boolean;
  isOrgMetadataReady: boolean;
  isOrgSlugReady: boolean;
  isBackendContextReady: boolean;
  
  // Action-specific readiness flags
  isReadyToSend: boolean;
  
  // Backward compatibility properties
  isContextReady: boolean;
  contextCheckComplete: boolean;
  missingContext: boolean;
  
  // Timestamp when fully ready (null if not ready)
  readySince: number | null;
  
  // Human-readable blockers
  blockers: string[];
  
  // New: Categorized blockers by component
  blockersByCategory: {
    auth?: string[];
    user?: string[];
    org?: string[];
    voice?: string[];
    backend?: string[];
  };
}

// Type for individual readiness check results
export interface ReadinessCheck {
  isReady: boolean;
  blockers: string[];
}

// New: Type for dependency priority levels
export enum DependencyPriority {
  CRITICAL = 'critical',   // Must be present for any functionality
  HIGH = 'high',           // Required for most functionality
  MEDIUM = 'medium',       // Enhances experience but not strictly required
  LOW = 'low'              // Nice to have
}

// New: Type for detailed dependency status
export interface DependencyStatus {
  name: string;
  isReady: boolean;
  priority: DependencyPriority;
  blockers: string[];
  readySince?: number;
}
