
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { LoginFormValues } from "@/types";
import { toast } from "@/hooks/use-toast";
import { syncUserRoleQuietly } from "@/lib/syncUserRole";

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
        // If login successful, quietly try to sync user role
        if (userId) {
          try {
            await syncUserRoleQuietly(userId);
          } catch (syncError) {
            console.error("Background sync after login failed:", syncError);
            // Don't block the login flow if sync fails
          }
        }
        
        // Get stored redirect path or use default
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user-dashboard";
        localStorage.removeItem("redirectAfterLogin");
        
        // Show success toast
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate(redirectPath, { replace: true });
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
