
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthProvider } from './useAuthProvider';
import { AuthContextType } from './types';
import * as authActions from './authActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authState = useAuthProvider();
  
  // Destructure all properties including sessionUserReady
  const {
    accessToken,
    session,
    user,
    userId,
    orgId,
    orgSlug,
    currentUser,
    loading,
    isAuthenticated,
    refreshSession,
    resetAuth,
    isRecoveringOrgContext,
    sessionUserReady,
  } = authState;

  console.log("🔄 Auth context values being provided:", {
    hasUser: !!user,
    hasUserMetadata: user ? !!user.user_metadata : false,
    userId,
    orgId,
    isAuthenticated
  });

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await authActions.signUp(
        email,
        password,
        fullName,
        () => {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account."
          });
          navigate('/auth/login');
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Error creating account",
            description: error.message
          });
        }
      );
    } catch (error) {
      // Error already handled in the action
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authActions.signIn(
        email, 
        password,
        (error) => {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message
          });
        }
      );
      return result;
    } catch (error) {
      // Error already handled in the action
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authActions.signInWithGoogle(
        (error) => {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message
          });
        }
      );
    } catch (error) {
      // Error already handled in the action
    }
  };

  const signOut = async () => {
    try {
      await authActions.signOut(
        (error) => {
          toast({
            variant: "destructive",
            title: "Error signing out",
            description: error.message
          });
        }
      );
      // Use our new resetAuth function to clear state
      resetAuth();
      navigate('/auth/login');
    } catch (error) {
      // Error already handled in the action
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authActions.resetPassword(
        email,
        (error) => {
          toast({
            variant: "destructive",
            title: "Password reset failed",
            description: error.message
          });
        }
      );
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link"
      });
    } catch (error) {
      // Error already handled in the action
    }
  };

  const updateProfile = async (data: any) => {
    await authActions.updateProfile(data);
  };

  const mergedUser = {
    ...currentUser,
    ...user,
    user_metadata: {
      ...(currentUser?.user_metadata || {}),
      ...(user?.user_metadata || {})
    }
  };
  
  // Create a wrapper for refreshSession that returns void instead of boolean
  const refreshSessionWrapper = async (reason: string): Promise<void> => {
    await refreshSession(reason);
    // Void return type, ignoring the boolean result
  };

  const value: AuthContextType = {
    session,
    user: mergedUser,
    userId,
    orgId,
    orgSlug,
    currentUser: mergedUser,
    loading,
    isAuthenticated,
    isRecoveringOrgContext,
    sessionUserReady,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    accessToken,
    refreshSession: refreshSessionWrapper,
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
