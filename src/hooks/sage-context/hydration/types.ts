
/**
 * State for tracking hydration progress
 */
export interface HydrationState {
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  completedSteps: string[];
  totalSteps: number;
}
