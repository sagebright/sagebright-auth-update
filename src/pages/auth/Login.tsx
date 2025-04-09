
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
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";

  useEffect(() => {
    // If user is already authenticated, redirect them appropriately
    if (user) {
      console.log("✅ User already authenticated, redirecting to dashboard");
      const role = user.user_metadata?.role || 'user';
      const targetPath = role === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      
      // Add a small delay to ensure state is fully updated
      const redirectTimer = setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will be handled by the AuthContext after successful Google sign-in
    } catch (error) {
      // Error is handled in the auth context
    }
  };

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
