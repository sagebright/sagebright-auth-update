
import { hydrateSageContext } from '@/lib/api/sageContextApi';
import { BackendContextState } from '../types';

/**
 * Fetches context from the backend API
 */
export async function fetchBackendContext(
  userId: string, 
  orgId: string, 
  orgSlug: string | null,
  onSuccess: (context: any) => void,
  onError: (error: any) => void
): Promise<void> {
  try {
    console.log("🔄 Fetching Sage context from backend", { userId, orgId, orgSlug });
    
    const context = await hydrateSageContext(userId, orgId, orgSlug);
    
    if (context) {
      console.log("🧠 Live Sage context:", context);
      onSuccess(context);
    } else {
      console.warn("⚠️ No context data returned from API");
      onError(new Error("Failed to load context data"));
    }
  } catch (error) {
    console.error("❌ Error fetching context:", error);
    onError(error instanceof Error ? error : new Error("Unknown error fetching context"));
  }
}

/**
 * Creates initial backend context state
 */
export function createInitialBackendState(
  userContext: any | null = null,
  orgContext: any | null = null
): BackendContextState {
  return {
    userContext,
    orgContext,
    isLoading: false,
    error: null,
    timedOut: false
  };
}
