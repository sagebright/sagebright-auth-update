
/**
 * Type definition for the hydration progress tracking state
 */
export interface HydrationState {
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  completedSteps: string[];
  totalSteps: number;
}

/**
 * Type for the result of the hydration process
 */
export interface HydrationResult {
  isComplete: boolean;
  progressPercent: number;
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  completedSteps: string[];
  totalSteps: number;
}

/**
 * Type for the context hydration hook result
 */
export interface ContextHydrationResult {
  backendContext: {
    userContext: any | null;
    orgContext: any | null;
    isLoading: boolean;
    error: Error | null;
  };
  hydration: HydrationResult;
}
