
import { toast } from "@/hooks/use-toast";

interface ApiErrorOptions {
  context?: string;
  fallbackMessage?: string;
  showToast?: boolean;
  variant?: "default" | "destructive";
}

/**
 * Handles API errors consistently across the application
 * @param error The error object from the API call
 * @param options Configuration options for error handling
 */
export function handleApiError(
  error: unknown,
  options: ApiErrorOptions = {}
): void {
  const {
    context = "",
    fallbackMessage = "Something went wrong. Please try again.",
    showToast = true,
    variant = "destructive"
  } = options;
  
  // Log the error with context for debugging
  console.error(`[Error${context ? `: ${context}` : ""}]`, error);
  
  // Extract error message
  const errorMessage = extractErrorMessage(error) || fallbackMessage;
  
  // Show toast notification if enabled
  if (showToast) {
    toast({
      title: "Error",
      description: errorMessage,
      variant,
    });
  }
}

/**
 * Extracts a human-readable error message from various error types
 */
function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  
  return undefined;
}
