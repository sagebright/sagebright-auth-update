
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Table, TableHead, TableBody, TR, TH, TD } from "@/components/design-system/loading/SimpleTable";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

// Basic Signup Form Schema
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

// Advanced Profile Form Schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    marketing: z.boolean().default(false),
  })
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Payment Form Schema
const paymentSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  saveCard: z.boolean().default(false)
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const FormValidationExamples = () => {
  // Sign Up Form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSignupSubmit = (values: SignupFormValues) => {
    toast({
      title: "Account created successfully",
      description: "Check your email for verification instructions.",
      variant: "default",
    });
  };

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      bio: "",
      website: "",
      notifications: {
        email: true,
        sms: false,
        marketing: false,
      }
    },
  });

  const onProfileSubmit = (values: ProfileFormValues) => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    });
  };

  // Payment Form
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
  });

  const onPaymentSubmit = (values: PaymentFormValues) => {
    // Simulate API error
    if (values.cardNumber === "4111111111111111") {
      // Show error toast
      toast({
        title: "Payment failed",
        description: "This card has been declined. Please try another card.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-charcoal">Form Validation Patterns</h2>
        <p className="text-muted-foreground">
          Consistent form validation enhances the user experience by providing clear feedback and preventing errors.
        </p>

        <Table>
          <TableHead>
            <TR>
              <TH>Pattern</TH>
              <TH>When to use</TH>
              <TH>Example</TH>
            </TR>
          </TableHead>
          <TableBody>
            <TR>
              <TD>Inline validation</TD>
              <TD>For immediate feedback on individual fields</TD>
              <TD>Email formats, password strength</TD>
            </TR>
            <TR>
              <TD>On-submit validation</TD>
              <TD>For validating the entire form at once</TD>
              <TD>When fields depend on each other</TD>
            </TR>
            <TR>
              <TD>Descriptive error messages</TD>
              <TD>When users need specific guidance</TD>
              <TD>Password requirements, format constraints</TD>
            </TR>
          </TableBody>
        </Table>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sign Up Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up Form</CardTitle>
            <CardDescription>Demonstrates password validation with multiple requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@sagebright.ai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must contain at least 8 characters, one uppercase letter, one number, and one special character.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Form</CardTitle>
            <CardDescription>Demonstrates optional fields and complex validation</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe123" {...field} />
                      </FormControl>
                      <FormDescription>
                        Can contain letters, numbers, and underscores only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="notifications.email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Email notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="notifications.sms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>SMS notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Update Profile</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Form</CardTitle>
            <CardDescription>Demonstrates input formatting and error handling</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Testing instructions</AlertTitle>
              <AlertDescription>
                Use card number 4111111111111111 to simulate a payment error.
              </AlertDescription>
            </Alert>

            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <FormField
                  control={paymentForm.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={paymentForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234567890123456" 
                          maxLength={16} 
                          {...field} 
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={paymentForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            maxLength={5} 
                            {...field} 
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              // Auto-format to MM/YY
                              if (value.length > 2) {
                                value = `${value.slice(0, 2)}/${value.slice(2)}`;
                              }
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            maxLength={4} 
                            {...field} 
                            onChange={(e) => {
                              // Only allow digits
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={paymentForm.control}
                  name="saveCard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Save card for future payments</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Process Payment</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-medium text-charcoal">Best Practices</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Clear Error Messages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Write specific, actionable error messages. Avoid technical jargon and explain how to fix the problem.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Prevent Errors</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use input masks and formatting helpers to prevent users from entering invalid data in the first place.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Progressive Disclosure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Only show validation errors after the user has interacted with the field, not on initial form load.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FormValidationExamples;
