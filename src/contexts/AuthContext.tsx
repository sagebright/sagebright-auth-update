
// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { getUsers } from '@/lib/backendApi'; // 👈 New backend-driven source
import { useToast } from '@/hooks/use-toast';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userId: string | null;
  orgId: string | null;
  currentUser: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>; // placeholder for future
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user from backend once userId is known
  useEffect(() => {
    if (!userId) return;

    getUsers()
      .then(users => {
        const match = users.find(u => u.id === userId);
        setCurrentUser(match || null);
        setOrgId(match?.org_id || null);
      })
      .catch(err => {
        console.error('Error loading current user:', err);
      });
  }, [userId]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔥 Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setUserId(session?.user?.id ?? null);
        
        // Handle org-based routing on auth state change
        if (event === 'SIGNED_IN' && session?.user) {
          const userOrgId = session.user.user_metadata?.org_id;
          if (userOrgId) {
            const currentOrg = getOrgFromUrl();
            if (!currentOrg || currentOrg !== userOrgId) {
              console.log('🏢 Redirecting to org subdomain:', userOrgId);
              // Store path for after subdomain redirect
              sessionStorage.setItem('lastAuthenticatedPath', 
                localStorage.getItem("redirectAfterLogin") || '/user-dashboard');
              redirectToOrgUrl(userOrgId);
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔥 Session in getSession():', session);

      setSession(session);
      setUser(session?.user ?? null);
      setUserId(session?.user?.id ?? null);
      setAccessToken(session?.access_token ?? null);
      
      // Check for organization-based routing on initial load
      if (session?.user) {
        const userOrgId = session.user.user_metadata?.org_id;
        if (userOrgId) {
          const currentOrg = getOrgFromUrl();
          if (!currentOrg || currentOrg !== userOrgId) {
            // Only redirect if not on auth pages
            if (!window.location.pathname.startsWith('/auth')) {
              console.log('🏢 Redirecting to org subdomain on load:', userOrgId);
              redirectToOrgUrl(userOrgId);
              setLoading(false);
              return;
            }
          }
        }
      }
      
      setLoading(false);
    });
    

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account."
      });

      navigate('/auth/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Check for organization context
      const userOrgId = data.user?.user_metadata?.org_id;
      if (userOrgId) {
        const currentOrg = getOrgFromUrl();
        if (!currentOrg || currentOrg !== userOrgId) {
          console.log('🏢 Redirecting to org subdomain after sign in:', userOrgId);
          // Store path for after subdomain redirect
          const redirectPath = localStorage.getItem("redirectAfterLogin") || '/user-dashboard';
          sessionStorage.setItem('lastAuthenticatedPath', redirectPath);
          localStorage.removeItem("redirectAfterLogin");
          redirectToOrgUrl(userOrgId);
          return data;
        }
      }

      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to root domain on signout if on a subdomain
      const currentOrg = getOrgFromUrl();
      if (currentOrg) {
        window.location.href = window.location.protocol + '//' + 
          window.location.hostname.split('.').slice(1).join('.');
        return;
      }
      
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message
      });
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    console.warn("🔧 TODO: Replace with PATCH /api/users/:id");
    // Will replace Supabase update with backend route later
  };

  const value: AuthContextType = {
    session,
    user,
    userId,
    orgId,
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
