
/**
 * Auth state cache/throttle utilities
 * Centralizes result cache, throttling, exponential backoff, etc.
 */

import type { AuthPayload } from "./backendAuth";

interface LastAuthCheck {
  timestamp: number;
  result: AuthPayload | null;
  pending: boolean;
  consecutiveErrors: number;
  lastErrorTime: number;
}

export const lastAuthCheckRef: LastAuthCheck = {
  timestamp: 0,
  result: null,
  pending: false,
  consecutiveErrors: 0,
  lastErrorTime: 0
};

// Used by resetAuthState and potentially test utilities
export function resetAuthStateCache() {
  console.log("🔄 Resetting auth state cache");
  lastAuthCheckRef.result = null;
  lastAuthCheckRef.timestamp = 0;
  lastAuthCheckRef.pending = false;
  lastAuthCheckRef.consecutiveErrors = 0;
  lastAuthCheckRef.lastErrorTime = 0;
}
