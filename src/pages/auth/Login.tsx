
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
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { isAuthenticated, user, loading, activeIntent } = useLoginRedirect();
  const location = useLocation();
  
  // Add a mount tracker to prevent duplicate initializations
  const isMountedRef = useRef(false);
  const formInitializedRef = useRef(false);
  
  useEffect(() => {
    // Only log mount once per component lifecycle
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      
      // Add timestamp to see when login components mount/unmount
      const timestamp = new Date().toISOString();
      console.log(`🔒 Login page mounted at ${timestamp} [auth: ${isAuthenticated}] [intent: ${activeIntent?.destination || 'none'}]`);

      // Check if form is properly initialized
      if (form) {
        formInitializedRef.current = true;
        console.log("✅ Login form is initialized:", { 
          isDirty: form.formState.isDirty,
          isValid: form.formState.isValid,
          errors: Object.keys(form.formState.errors).length > 0
        });
      } else {
        console.error("❌ Login form is not initialized properly");
      }
    }
    
    return () => {
      // Only log unmount if we previously logged mount
      if (isMountedRef.current) {
        console.log(`📄 Login page unmounted at ${new Date().toISOString()}`);
        isMountedRef.current = false;
      }
    };
  }, [isAuthenticated, user, loading, authError, activeIntent, form]);
  
  const handleGoogleSignIn = () => {
    console.log("🔍 Google sign-in button clicked");
    signInWithGoogle();
  };
  
  const handleLoginSubmit = async (values) => {
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
  
  // Add more detailed debugging logs
  console.log("📄 Login page render data:", {
    formExists: !!form,
    formState: form?.formState ? {
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
      hasErrors: Object.keys(form.formState.errors || {}).length > 0
    } : 'Not initialized',
    isAuthenticated, 
    hasUser: !!user, 
    loading, 
    authError, 
    activeIntent: activeIntent?.destination || 'none',
    formMode: form?.mode,
    formValues: form ? {
      email: !!form.getValues().email,
      password: !!form.getValues().password
    } : 'No values',
  });
  
  // If authenticated and has user data, show loading/redirect UI
  if (isAuthenticated && user) {
    return <LoadingRedirect />;
  }

  // Check if we're in development mode to show diagnostic tools
  const isDev = import.meta.env.DEV;

  // Use a fallback UI when form initialization fails
  const renderFormOrFallback = () => {
    if (!form) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          <h4 className="font-bold mb-2">Login Form Initialization Failed</h4>
          <p>Please try refreshing the page or check console logs for errors.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return (
      <LoginForm 
        form={form}
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        authError={authError}
      />
    );
  };

  // Always return the auth layout with form or fallback
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
        <p className="mb-4 text-gray-600">
          Enter your credentials to sign in to your account
        </p>
      </>
      
      {/* Show backend health check in development mode */}
      {isDev && <BackendHealthCheck />}
      
      <div className="space-y-4">
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        <AuthDivider />
        
        {/* Include the form or fallback UI */}
        {renderFormOrFallback()}
        
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
