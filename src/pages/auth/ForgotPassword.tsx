
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/auth/AuthContext";
import EmailInput from "@/components/auth/EmailInput";
import AuthLayout from "@/components/auth/AuthLayout";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      heading="Reset your password"
      subheading="We'll send you a link to reset your password"
      footer={
        <p className="text-sm text-gray-600 font-roboto">
          Remember your password?{" "}
          <Link to="/auth/login" className="font-medium text-sagebright-green hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      <>{/* Description */}
        Enter your email address and we'll send you a link to reset your password
      </>
      
      <>{/* Content */}
        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4">
            <p className="text-sm">
              We've sent a password reset link to your email address. Please check your inbox.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-helvetica">Email</FormLabel>
                    <FormControl>
                      <EmailInput
                        id="reset-email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-sagebright-green hover:bg-sagebright-green/90 font-helvetica"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                    Sending reset link...
                  </div>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </Form>
        )}
      </>
    </AuthLayout>
  );
}
