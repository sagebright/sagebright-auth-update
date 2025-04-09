
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userId: string | null;
  orgId: string | null;
  orgSlug: string | null; // Added orgSlug property
  currentUser: any | null;
  loading: boolean;
  isAuthenticated: boolean; // Added isAuthenticated property
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  accessToken: string | null;
}
