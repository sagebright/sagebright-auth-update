
export interface AuthContextType {
  session: any | null;
  user: any | null;
  userId: string | null;
  orgId: string | null;
  orgSlug: string | null;
  currentUser: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  accessToken: string | null;
  refreshSession?: (reason: string) => Promise<void>; 
  isRecoveringOrgContext?: boolean;
  sessionUserReady: boolean;
}

// Add ButtonProps interface used by button component
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
