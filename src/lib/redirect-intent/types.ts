
/**
 * Core types for the redirect intent management system
 */

export type RedirectReason = 'auth' | 'permission' | 'user-initiated' | 'session-restore';

export interface RedirectIntent {
  // The full path including query parameters
  destination: string;
  
  // Why this redirect was triggered
  reason: RedirectReason;
  
  // When this intent was created
  timestamp: number;
  
  // Optional additional data to preserve across redirects
  metadata?: {
    // Voice parameter to restore
    voiceParam?: string;
    
    // Where the redirect originated from
    source?: string;
    
    // Any additional context state to restore
    contextState?: Record<string, unknown>;
    
    // Track the intent ID for tracing through logs
    intentId?: string;
    
    // User's session ID when intent was created (if authenticated)
    sessionId?: string | null;
  };
  
  // When this intent should be considered stale (milliseconds since epoch)
  expiry?: number;
  
  // Priority level for competing intents (higher wins)
  priority?: number;
}

export interface RedirectIntentState {
  // The current active redirect intent
  activeIntent: RedirectIntent | null;
  
  // Whether a redirect is currently in progress
  redirectInProgress: boolean;
  
  // History of previous redirects for debugging
  recentIntents: RedirectIntent[];
  
  // Whether an intent restoration is blocked
  isBlocked: boolean;
  
  // Reason why intent restoration is blocked, if applicable
  blockReason?: string;
  
  // Current status of intent processing
  status: 'idle' | 'capturing' | 'validating' | 'executing' | 'completed' | 'failed';
  
  // Detailed error information if intent failed
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Validation result for redirect intents
 */
export interface IntentValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Configuration options for redirect intent manager
 */
export interface RedirectIntentOptions {
  // Max number of recent intents to keep in history
  maxHistory?: number;
  
  // Default expiry time for intents in milliseconds (30 minutes)
  defaultExpiryMs?: number;
  
  // Whether to enable detailed logging
  enableLogging?: boolean;
  
  // Storage key for persisting intents
  storageKey?: string;
  
  // Default priority for new intents
  defaultPriority?: number;
  
  // Whether to automatically clear stale intents on startup
  cleanupStaleIntents?: boolean;
}

