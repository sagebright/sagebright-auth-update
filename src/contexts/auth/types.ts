
import { User, Session } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
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
  sessionUserReady: boolean; // Changed from optional to required
}
