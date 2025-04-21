
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import LoadingRedirect from "@/components/auth/LoadingRedirect";
import SessionStatusIndicator from "@/components/auth/SessionStatusIndicator";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { isAuthenticated, user, loading, activeIntent } = useLoginRedirect();
  const location = useLocation();
  
  useEffect(() => {
    console.log("📄 Login page mounted", { 
      isAuthenticated, 
      hasUser: !!user,
      loading, 
      authError, 
      activeIntent: activeIntent?.destination || 'none' 
    });
  }, [isAuthenticated, user, loading, authError, activeIntent]);
  
  // If authenticated and has user data, show loading/redirect UI
  if (isAuthenticated && user) {
    console.log("🔐 User already authenticated, preparing redirect");
    return <LoadingRedirect />;
  }

  // Always show the login form with optional loading indicator
  return (
    <AuthLayout
      title="Sign in"
      heading="Welcome back"
      subheading="Sign in to your account"
      footer={
        <p className="text-sm text-gray-600 font-roboto">
          New user accounts can only be created by an administrator.
        </p>
      }
    >
      <>
        <SessionStatusIndicator loading={loading} />
        Enter your credentials to sign in to your account
      </>
      
      <div className="space-y-4">
        <GoogleSignInButton onClick={signInWithGoogle} />
        <AuthDivider />
        <LoginForm 
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          authError={authError}
        />
        {activeIntent && (
          <div className="text-xs text-gray-500 mt-2 italic">
            You'll be redirected to your last location after signing in.
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
