
import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { fetchAuth } from '@/lib/backendAuth';
import { toast } from "@/hooks/use-toast";
import { signIn } from "@/lib/api/authApi";

// Enhance password requirements for clarity (min 6 chars, customizable)
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const loginAttemptRef = useRef<boolean>(false);
  const maxRetries = 3;
  const [retryCount, setRetryCount] = useState(0);

  const { activeIntent, executeRedirect, clearIntent } = useRedirectIntentManager();

  // Enable validation on change and blur for real-time feedback
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
    criteriaMode: "all"
  });

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    console.log("📋 LoginForm hook initialized");
    return () => {
      // Reset submission state when component unmounts
      console.log("📋 LoginForm hook cleanup");
      setIsLoading(false);
      setIsSubmitting(false);
    };
  }, []);

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      if (isSubmitting || loginAttemptRef.current) {
        console.log("🛑 Form submission already in progress, preventing duplicate");
        return;
      }
      
      loginAttemptRef.current = true;
      setFormSubmitted(true);
      setIsSubmitting(true);
      console.log("🚀 Login attempt started", { email: values.email });
      setIsLoading(true);
      setAuthError(null);

      try {
        console.log(`🔧 Login process starting with email: ${values.email}, sending to backend API`);
        
        try {
          // Use our centralized auth API with a longer timeout
          const loginResult = await signIn(values.email, values.password);
          console.log("✅ Login API call successful with response:", loginResult);
        } catch (fetchError) {
          console.error("⚠️ Login API error:", fetchError);
          setAuthError(fetchError instanceof Error ? fetchError.message : "Login failed. Please try again.");
          setIsLoading(false);
          setIsSubmitting(false);
          loginAttemptRef.current = false;
          return;
        }

        // Add a small delay before checking auth to ensure cookies are fully processed
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          console.log("🔄 Fetching updated auth state after login");
          // Force fetch auth to ensure we get the latest session after login
          
          let authData;
          let fetchSuccess = false;
          let currentRetry = 0;
          
          // Try to fetch auth data with retries
          while (!fetchSuccess && currentRetry < maxRetries) {
            try {
              currentRetry++;
              console.log(`🔄 Auth fetch attempt ${currentRetry}/${maxRetries}`);
              authData = await fetchAuth({ forceCheck: true });
              if (authData && authData.session) {
                fetchSuccess = true;
                console.log("✅ Auth fetch succeeded on attempt", currentRetry);
              } else {
                // Short delay before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } catch (retryError) {
              console.error(`❌ Auth fetch retry ${currentRetry} failed:`, retryError);
              // If not the last retry, wait before trying again
              if (currentRetry < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          setRetryCount(currentRetry);
          
          if (!fetchSuccess) {
            throw new Error(`Failed to fetch auth data after ${maxRetries} attempts`);
          }
          
          // Explicitly refresh session to update auth context
          if (refreshSession) {
            console.log("🔄 Refreshing session context");
            await refreshSession("post-login");
            console.log("✅ Session refresh completed");
          } else {
            console.warn("⚠️ refreshSession function not available");
          }
        } catch (sessionErr) {
          console.error("❌ Session fetch error:", sessionErr);
          // More descriptive error message
          setAuthError(
            "Authentication successful, but there was a problem loading your session. " + 
            "This could be due to a server configuration issue. Please try again or contact support."
          );
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "Failed to load session context. The server may be misconfigured."
          });
          setIsLoading(false);
          setIsSubmitting(false);
          loginAttemptRef.current = false;
          return;
        }
        
        console.log("🎉 Login process completed successfully");

        // Check if we need to redirect based on intent
        if (activeIntent) {
          console.log("🔀 Executing redirect based on stored intent");
          executeRedirect();
        } else {
          console.log("🏠 Redirecting to dashboard");
          navigate("/user-dashboard");
        }
      } catch (err: any) {
        console.error("🔥 Login error caught:", err);
        setAuthError(err.message || "An unexpected error occurred during login.");
        toast({
          variant: "destructive",
          title: "Login Error",
          description: err.message || "An unexpected error occurred"
        });
        console.error('Login error details:', err);
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
        loginAttemptRef.current = false;
      }
    },
    [refreshSession, activeIntent, executeRedirect, navigate, isSubmitting, maxRetries]
  );

  return {
    form,
    isLoading,
    authError,
    onSubmit,
    formSubmitted,
    retryCount
  };
};
