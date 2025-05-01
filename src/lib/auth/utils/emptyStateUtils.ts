
/**
 * Utilities for handling empty auth states
 */

import type { AuthPayload } from "../../api/auth/types";

/**
 * Creates an empty auth payload for unauthenticated states
 */
export function createEmptyAuthPayload(): AuthPayload {
  return {
    session: null as any,
    user: null as any,
    org: null as any
  };
}
