
export interface AskSagePageState {
  // Auth context
  user: any | null;
  userId: string | null;
  orgId: string | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  isRecoveryVisible?: boolean;
  showWelcomeMessage?: boolean;
  
  // Chat state
  messages: any[];
  isLoading: boolean;
  suggestedQuestions: any[];
  
  // Reflection state
  showReflection: boolean;
  setShowReflection: (show: boolean) => void;
  handleReflectionSubmit: (data: any) => void;
  
  // Message handlers
  sendMessageToSage: (message: string) => void;
  handleSelectQuestion: (question: string) => void;
  handleFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  
  // Context state
  isRecoveringOrg: boolean; // Explicitly typed as boolean
  voiceParam: string | null;
  
  // Debug and readiness
  debugPanel: any;
  isContextReady: boolean;
  sessionUserReady: boolean;
  
  // Detailed readiness flags
  isReadyToRender: boolean;
  isSessionReady: boolean;
  isOrgReady: boolean;
  isVoiceReady: boolean;
  isSessionStable: boolean;
  blockers: string[];
  readySince: number | null;
}
