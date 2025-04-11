
import { toast } from "@/hooks/use-toast";

interface ApiErrorOptions {
  context?: string;
  fallbackMessage?: string;
  showToast?: boolean;
  variant?: "default" | "destructive";
  duration?: number;
  shouldThrow?: boolean;
  silent?: boolean;
}

/**
 * Handles API errors consistently across the application
 * @param error The error object from the API call
 * @param options Configuration options for error handling
 * @returns The formatted error message for additional usage if needed
 */
export function handleApiError(
  error: unknown,
  options: ApiErrorOptions = {}
): string {
  const {
    context = "",
    fallbackMessage = "Something went wrong. Please try again.",
    showToast = true,
    variant = "destructive",
    duration = 5000,
    shouldThrow = false,
    silent = false
  } = options;
  
  // For background operations or expected errors (like permission issues)
  // we want to log them but not necessarily show them to the user
  const isSilentOperation = silent || 
    (typeof error === 'object' && 
     error !== null && 
     'message' in error && 
     typeof error.message === 'string' && 
     (
       error.message.includes('permission denied') || 
       error.message.includes('insufficient role') || 
       error.message.includes('forbidden') ||
       error.message.includes('Forbidden')
     )
    );
  
  // Always log the error with context for debugging
  if (!isSilentOperation || context.includes('critical')) {
    console.error(`[Error${context ? `: ${context}` : ""}]`, error);
  } else {
    // For expected permission errors, just log as warning
    console.warn(`[Warning${context ? `: ${context}` : ""}]`, error);
  }
  
  // Extract error message
  const errorMessage = extractErrorMessage(error) || fallbackMessage;
  
  // Show toast notification if enabled and not silenced
  if (showToast && !isSilentOperation) {
    toast({
      title: "Error",
      description: errorMessage,
      variant,
      duration,
    });
  }
  
  // Rethrow if needed for promise chaining
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  
  return errorMessage;
}

/**
 * Extracts a human-readable error message from various error types
 */
function extractErrorMessage(error: unknown): string | undefined {
  // String errors
  if (typeof error === "string") {
    return error;
  }
  
  // Standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Supabase error format
  if (
    error && 
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  
  // Axios error format
  if (
    error && 
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    return String(error.response.data.message);
  }
  
  return undefined;
}

/**
 * Displays a success message toast
 */
export function showSuccess(message: string, duration: number = 5000): void {
  toast({
    title: "Success",
    description: message,
    duration,
  });
}

/**
 * Displays an info message toast
 */
export function showInfo(message: string, duration: number = 5000): void {
  toast({
    title: "Information",
    description: message,
    duration,
  });
}
