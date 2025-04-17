
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiErrorOptions {
  context?: string;
  showToast?: boolean;
  fallbackMessage?: string;
  silent?: boolean; // Add the silent property
}

export function handleApiError(error: unknown, options: ApiErrorOptions = {}): ApiError {
  const { context = 'general', showToast = false, silent = false } = options;
  
  // Log the error with context, unless silent is true
  if (!silent) {
    console.error(`API Error [${context}]:`, error);
  }
  
  // Create a standardized error object
  let apiError: ApiError;
  
  if (error instanceof Error) {
    apiError = {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  } else if (typeof error === 'string') {
    apiError = {
      message: error,
      code: 'STRING_ERROR'
    };
  } else {
    apiError = {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  // Show toast if requested and not silent
  if (showToast && !silent) {
    console.log('Would show toast with error:', apiError.message);
    // In a real implementation, this would display a toast
  }
  
  return apiError;
}

// Functions for showing notifications
export function showSuccess(message: string) {
  console.log('Success:', message);
  // In a real implementation, this would display a toast or notification
}

export function showInfo(message: string) {
  console.log('Info:', message);
  // In a real implementation, this would display a toast or notification
}
