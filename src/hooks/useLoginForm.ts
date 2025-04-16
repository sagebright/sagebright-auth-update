
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useRedirectIntentManager } from "@/lib/redirect-intent";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const { signIn, userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use intent manager to handle redirects after login
  const { activeIntent, executeRedirect, clearIntent } = useRedirectIntentManager();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn(values.email, values.password);
      
      if (result?.error) {
        setAuthError(result.error.message || "Authentication failed");
      } else {
        // Prioritize stored intent over legacy redirect path
        if (activeIntent) {
          console.log("🎯 Intent-based redirect after login:", activeIntent.destination);
          
          toast({
            title: "Login successful",
            description: "Redirecting you to your last location...",
          });
          
          // We'll let the Login component handle the redirect
          // This prevents race conditions between form submission and auth state updates
        } else {
          // Get stored redirect path or use default
          const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";
          localStorage.removeItem("redirectAfterLogin");
          
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          console.log("🔄 Legacy redirect after login:", redirectPath);
          // We'll let the Login component handle the redirect
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    authError,
    onSubmit,
  };
};
