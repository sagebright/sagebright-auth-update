
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth/AuthContext";
import { syncExistingUsers } from "@/lib/syncExistingUsers";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the login form validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      console.log("🔑 Attempting login with:", data.email);
      
      // Perform sign in operation
      const authData = await signIn(data.email, data.password);
      
      // The login was successful if we reach this point
      console.log("✅ Login successful");
      
      // Try to sync users after login but don't block the flow
      try {
        await syncExistingUsers();
        console.log("✅ User sync completed after login");
      } catch (syncError) {
        console.error("⚠️ User sync failed but login succeeded:", syncError);
        // Continue with login flow even if sync fails
      }
      
      // Get the correct redirect path based on role
      const userRole = authData?.user?.user_metadata?.role || 'user';
      const redirectPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
      
      // Show a toast for successful login
      toast({
        title: "Login successful",
        description: `Welcome back! Redirecting to your dashboard...`,
      });
      
      // Redirect to the appropriate dashboard
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
        // Reset loading state after redirection has been triggered
        setIsLoading(false);
      }, 500);
      
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
      // Reset only the password field, not the email
      form.setValue('password', '');
    }
  };

  return {
    form,
    isLoading,
    authError,
    setAuthError,
    onSubmit,
  };
}
