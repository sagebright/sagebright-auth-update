
import { toast } from '@/components/ui/use-toast';

// Define the error options interface
export interface ApiErrorOptions {
  context?: string;
  showToast?: boolean;
  silent?: boolean;
  fallbackMessage?: string;
  status?: number;
  code?: string;
}

/**
 * Centralized error handler for API errors
 */
export function handleApiError(error: unknown, options: ApiErrorOptions = {}): ApiErrorResponse {
  const { 
    context = 'api', 
    showToast = true,
    silent = false,
    fallbackMessage = 'Something went wrong. Please try again.'
  } = options;
  
  let errorMessage: string;
  let status: number | undefined = options.status;
  let code: string | undefined = options.code;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    // Try to extract status and code from error if available
    if ('status' in error) {
      status = (error as any).status;
    }
    if ('code' in error) {
      code = (error as any).code;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Try to extract message from object errors
    errorMessage = (error as any).message || 'Unknown error occurred';
    status = (error as any).status || status;
    code = (error as any).code || code;
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
  
  // Return the error details for potential use by caller
  return {
    message: errorMessage,
    status,
    code
  };
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Show a success toast message
 */
export function showSuccess(message: string, duration: number = 3000) {
  toast({
    title: "Success",
    description: message,
    duration
  });
}

/**
 * Show an informational toast message
 */
export function showInfo(message: string, duration: number = 5000) {
  toast({
    title: "Information",
    description: message,
    duration
  });
}
