export interface HydrationState {
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  completedSteps: string[];
  totalSteps: number;
}

// Add this type for org recovery
export interface OrgRecoveryState {
  isRecoveringOrg: boolean;
  hasRecoveredOrgId: boolean;
  recoveryError?: Error | null;
}
