
export interface ContextHydrationParams {
  userId: string;
  orgId: string;
  orgSlug: string;
}

export interface HydrationState {
  completedSteps: string[]; // Changed from number to string[] to match usage
  totalSteps: number;
  progressPercent: number;
  isComplete: boolean;
  duration: number | null;
  timedOut: boolean;
  startTime: number | null; // Added missing property
  endTime: number | null;   // Added missing property
}

export interface BackendContextState {
  userContext: any | null;
  orgContext: any | null;
  isLoading: boolean;
  error: any | null;
  timedOut: boolean;
}

export interface ContextHydrationResult {
  hydration: HydrationState;
  isAuthReady: boolean;
  isSessionReady: boolean;
  isUserMetadataReady: boolean;
  isOrgReady: boolean;
  isVoiceReady: boolean;
  isBackendContextReady: boolean;
  isReadyToRender: boolean;
  isReadyToSend: boolean;
  backendContext: BackendContextState;
  blockersByCategory?: Record<string, string[]>;
}

// Add missing OrgRecoveryState type
export interface OrgRecoveryState {
  isRecoveringOrg: boolean;
  hasRecoveredOrgId: boolean;
  recoveryError: Error | null;
}
