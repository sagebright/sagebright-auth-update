
import { toast } from '@/components/ui/use-toast';

// Maximum time to wait for context hydration before using fallback
export const MAX_HYDRATION_TIME = 10000; // 10 seconds

/**
 * Creates fallback contexts when hydration times out
 */
export function createFallbackContexts(
  userId: string | null,
  orgId: string | null, 
  orgSlug: string | null
) {
  return {
    userContext: { 
      _fallback: true, 
      id: userId || 'fallback-user'
    },
    orgContext: {
      _fallback: true,
      id: orgId || 'fallback-org',
      slug: orgSlug || 'fallback-slug'
    }
  };
}

/**
 * Shows a toast notification for timeout
 */
export function showTimeoutToast() {
  toast({
    title: "Some data may be incomplete",
    description: "We're having trouble loading all your information, but you can continue using the app with limited personalization.",
    duration: 5000
  });
}

/**
 * Shows a toast notification for API error
 */
export function showApiErrorToast() {
  toast({
    title: "Unable to load your personalized context",
    description: "Some features may be limited.",
    duration: 5000
  });
}
