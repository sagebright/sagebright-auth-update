
export interface HydrationState {
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  completedSteps: string[];
  totalSteps: number;
}

// Updated type with explicit boolean types
export interface OrgRecoveryState {
  isRecoveringOrg: boolean;
  hasRecoveredOrgId: boolean;
  recoveryError: Error | null;
}
