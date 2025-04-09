
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth/AuthContext";
import { syncUserRole } from "@/lib/syncUserRole";

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
      
      const response = await signIn(data.email, data.password);
      console.log("✅ Login successful");
      
      // Manually trigger role sync after successful login
      if (response && response.user && response.user.id) {
        try {
          console.log("🔄 Syncing user role after login");
          await syncUserRole(response.user.id);
        } catch (syncError) {
          console.error("⚠️ Role sync after login failed, but login was successful:", syncError);
          // We don't want to block the login if role sync fails
          // User experience is prioritized here
        }
      }
      
      // Redirect will be handled by AuthContext or useEffect in Login component
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
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
