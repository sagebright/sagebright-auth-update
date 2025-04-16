import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";
import { getOrgFromUrl } from "@/lib/subdomainUtils";
import { useToast } from "@/hooks/use-toast";

const ROLE_LANDING_PAGES = {
  admin: '/hr-dashboard',
  user: '/ask-sage',
  default: '/ask-sage'
};

export default function Login() {
  const { signInWithGoogle, user, isAuthenticated, loading, orgId, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, isLoading, authError, onSubmit } = useLoginForm();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  const redirectInProgressRef = useRef(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);
  const sessionStableRef = useRef(false);
  
  const redirectPath = localStorage.getItem("redirectAfterLogin") || null;
  const preserveSearch = localStorage.getItem("preserveSearchParams") || "";

  useEffect(() => {
    if (refreshSession && !loading) {
      console.log("🔄 Login page forcing session refresh");
      refreshSession("login page load");
    }
  }, [refreshSession, loading]);

  useEffect(() => {
    if (location.search && location.search.includes('voice=') && !localStorage.getItem("preserveSearchParams")) {
      localStorage.setItem("preserveSearchParams", location.search);
      const timestamp = new Date().toISOString();
      console.log(`📝 [${timestamp}] Stored search params for post-login redirect:`, {
        search: location.search,
        storedPath: localStorage.getItem("redirectAfterLogin"),
        voiceParam: new URLSearchParams(location.search).get('voice')
      });
    }
    
    if (loading) {
      console.log("⏳ Auth still loading on login page, waiting...");
      return;
    }

    if (isAuthenticated && user && user.user_metadata && !sessionStableRef.current) {
      console.log("✅ Login page detected stable session with metadata:", {
        role: user.user_metadata?.role || 'unknown',
        orgId: user.user_metadata?.org_id || 'unknown'
      });
      sessionStableRef.current = true;
    }

    if (isAuthenticated && user && sessionStableRef.current && 
        !hasRedirectedRef.current && !redirectInProgressRef.current) {
      
      redirectInProgressRef.current = true;
      hasRedirectedRef.current = true;
      
      const currentTime = Date.now();
      setLoginTimestamp(currentTime);
      
      const timestamp = new Date().toISOString();
      console.log(`✅ [${timestamp}] User authenticated on login page, handling redirect`);
      
      const storedRedirect = localStorage.getItem("redirectAfterLogin");
      const role = user.user_metadata?.role || 'default';
      const fallback = ROLE_LANDING_PAGES[role as keyof typeof ROLE_LANDING_PAGES] || ROLE_LANDING_PAGES.default;
      
      console.log(`🔍 Login redirect check [storedRedirect: ${storedRedirect}] [path: ${location.pathname}${location.search}]`);
      console.trace("Login redirect stack trace");
      
      let targetPath: string;
      
      if (storedRedirect && !['/', '/auth/login'].includes(storedRedirect)) {
        targetPath = storedRedirect;
        console.log(`🎯 [${timestamp}] Redirecting to stored redirect path:`, targetPath);
      } else {
        targetPath = fallback;
        console.log(`🎯 [${timestamp}] Redirecting to role-based fallback:`, fallback);
      }
      
      if (preserveSearch && !targetPath.includes('?')) {
        targetPath += preserveSearch;
      }
      
      toast({
        title: "Welcome back!",
        description: "Redirecting you back...",
      });
      
      localStorage.removeItem("redirectAfterLogin");
      localStorage.removeItem("preserveSearchParams");
      
      setTimeout(() => {
        if (document.location.pathname.startsWith('/auth')) {
          navigate(targetPath, { replace: true });
          setTimeout(() => {
            redirectInProgressRef.current = false;
          }, 1000);
        }
      }, 100);
    }
  }, [user, isAuthenticated, orgId, navigate, toast, location.search, location.pathname, redirectPath, preserveSearch]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Redirecting to dashboard...</span>
      </div>
    );
  }

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
