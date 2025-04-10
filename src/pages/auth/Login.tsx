
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { getOrgFromUrl } from "@/lib/subdomainUtils";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { signInWithGoogle, user, isAuthenticated, loading, orgId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { toast } = useToast();
  
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";

  useEffect(() => {
    // If auth is still loading, don't do anything yet
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    // If user is already authenticated AND has an org context, redirect them appropriately
    if (isAuthenticated && user && orgId) {
      console.log("✅ User already authenticated on login page with org context, redirecting to dashboard");
      
      // Check the role specifically from user_metadata
      const role = user.user_metadata?.role || 'user';
      const targetPath = role === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      
      console.log("🎯 Redirecting to:", targetPath, "based on role:", role);
      
      // Show a toast for redirection
      toast({
        title: "Already signed in",
        description: "Redirecting to your dashboard...",
      });
      
      // Clear any stored redirect paths to prevent loops
      localStorage.removeItem("redirectAfterLogin");
      
      // Redirect immediately to prevent login page flash
      navigate(targetPath, { replace: true });
    }
  }, [user, isAuthenticated, loading, orgId, navigate, toast]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will be handled by the AuthContext after successful Google sign-in
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }
  
  // If already authenticated, show a loading indicator instead of a flash of the login page
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Redirecting to dashboard...</span>
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
