
import { toast } from '@/components/ui/use-toast';

interface ErrorHandlingOptions {
  context?: string;
  showToast?: boolean;
  silent?: boolean;
  fallbackMessage?: string;
}

/**
 * Centralized error handler for API errors
 */
export function handleApiError(error: unknown, options: ErrorHandlingOptions = {}) {
  const { 
    context = 'api', 
    showToast = true,
    silent = false,
    fallbackMessage = 'Something went wrong. Please try again.'
  } = options;
  
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }
  
  // Log the error unless silent mode is enabled
  if (!silent) {
    console.error(`[Error: ${context}]`, error);
  }
  
  // Show toast notification if requested
  if (showToast) {
    toast({
      variant: "destructive",
      title: "API Error",
      description: errorMessage || fallbackMessage,
      duration: 5000
    });
  }
  
  // Return the error message for potential use by caller
  return errorMessage;
}
