
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { getOrgFromUrl } from "@/lib/subdomainUtils";

export default function Login() {
  const { signInWithGoogle, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";

  useEffect(() => {
    // If auth is still loading, don't do anything yet
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    // If user is already authenticated, redirect them appropriately
    if (isAuthenticated && user) {
      console.log("✅ User already authenticated on login page, redirecting to dashboard");
      console.log("👤 User role from metadata:", user.user_metadata?.role);
      
      // Check the role specifically from user_metadata
      const role = user.user_metadata?.role || 'user';
      const targetPath = role === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      
      console.log("🎯 Redirecting to:", targetPath, "based on role:", role);
      
      // Clear any stored redirect paths to prevent loops
      localStorage.removeItem("redirectAfterLogin");
      
      // Add a small delay to ensure state is fully updated
      const redirectTimer = setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, isAuthenticated, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will be handled by the AuthContext after successful Google sign-in
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  // Only render the login form if the user is not authenticated
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
      <>{/* Description */}
        Enter your credentials to sign in to your account
      </>
      
      <>{/* Content */}
        <div className="space-y-4">
          <GoogleSignInButton onClick={handleGoogleSignIn} />
          
          <AuthDivider />
          
          <LoginForm 
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            authError={authError}
          />
        </div>
      </>
    </AuthLayout>
  );
}
