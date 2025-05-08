
import React, { useEffect, useRef } from "react";
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
import BackendHealthCheck from "@/components/auth/BackendHealthCheck";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const { form, isLoading, authError, onSubmit, formSubmitted } = useLoginForm();
  const { isAuthenticated, user, loading, activeIntent } = useLoginRedirect();
  const location = useLocation();
  
  // Add a mount tracker to prevent duplicate initializations
  const isMountedRef = useRef(false);
  
  useEffect(() => {
    // Only log mount once per component lifecycle
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      
      // Add timestamp to see when login components mount/unmount
      const timestamp = new Date().toISOString();
      console.log(`📄 Login page mounted at ${timestamp}`, { 
        isAuthenticated, 
        hasUser: !!user,
        loading, 
        authError,
        activeIntent: activeIntent?.destination || 'none'
      });
    }
    
    return () => {
      // Only log unmount if we previously logged mount
      if (isMountedRef.current) {
        console.log(`📄 Login page unmounted at ${new Date().toISOString()}`);
        isMountedRef.current = false;
      }
    };
  }, [isAuthenticated, user, loading, authError, activeIntent]);
  
  const handleGoogleSignIn = () => {
    console.log("🔍 Google sign-in button clicked");
    signInWithGoogle();
  };
  
  const handleLoginSubmit = async (values: any) => {
    console.log("📝 Login form submitted with values:", {
      email: values.email,
      hasPassword: !!values.password
    });
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("❌ Error during login submission:", error);
    }
  };
  
  // If authenticated and has user data, show loading/redirect UI
  if (isAuthenticated && user) {
    return <LoadingRedirect />;
  }

  // Check if we're in development mode to show diagnostic tools
  const isDev = import.meta.env.DEV;

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
      <SessionStatusIndicator loading={loading} />
      <p className="mb-4 text-gray-600">
        Enter your credentials to sign in to your account
      </p>
      <div className="space-y-4">
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        <AuthDivider />
        <LoginForm 
          form={form}
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          authError={authError}
        />
        {activeIntent && (
          <div className="text-xs text-gray-500 mt-2 italic">
            You'll be redirected to your last location after signing in.
          </div>
        )}
        {isLoading && (
          <div className="text-xs text-gray-500 mt-2 italic text-center">
            Signing in...
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
