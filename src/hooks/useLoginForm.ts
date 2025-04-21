
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRedirectIntentManager } from "@/lib/redirect-intent";
import { fetchAuth } from '@/lib/backendAuth';
import { toast } from "@/hooks/use-toast";

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

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      console.log("🚀 Login attempt started", { email: values.email });
      setIsLoading(true);
      setAuthError(null);

      try {
        const BASE = import.meta.env.VITE_BACKEND_URL || "";
        console.log(`🔧 Login fetch preparing: ${BASE}/api/auth/login`);
        
        const loginRes = await fetch(`${BASE}/api/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        console.log(`✅ Login response received`, { 
          status: loginRes.status, 
          statusText: loginRes.statusText,
          ok: loginRes.ok
        });

        if (!loginRes.ok) {
          let errorMsg = 'Login failed';
          try {
            const data = await loginRes.json();
            console.log("⚠️ Login error response data:", data);
            errorMsg = data.error || data.message || errorMsg;
          } catch (parseError) {
            console.error("⚠️ Could not parse login error response:", parseError);
            try {
              const textResponse = await loginRes.text();
              console.log("📝 Raw error response:", textResponse.substring(0, 200) + (textResponse.length > 200 ? '...' : ''));
            } catch (textError) {
              console.error("⚠️ Could not get text from response:", textError);
            }
          }
          setAuthError(errorMsg);
          toast({
            variant: "destructive",
            title: "Login failed",
            description: errorMsg
          });
          setIsLoading(false);
          return;
        }

        try {
          console.log("🔄 Fetching updated auth state after login");
          // Force fetch auth to ensure we get the latest session after login
          await fetchAuth({ forceCheck: true });
          
          // Explicitly refresh session to update auth context
          if (refreshSession) {
            console.log("🔄 Refreshing session context");
            refreshSession("post-login");
            console.log("✅ Session refresh completed");
          } else {
            console.warn("⚠️ refreshSession function not available");
          }
        } catch (sessionErr) {
          console.error("❌ Session fetch error:", sessionErr);
          setAuthError("Authenticated, but failed to load session context. Please try reloading.");
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "Failed to load session context. Please try reloading."
          });
          setIsLoading(false);
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
      }
    },
    [refreshSession, activeIntent, executeRedirect, navigate]
  );

  return {
    form,
    isLoading,
    authError,
    onSubmit,
  };
};
