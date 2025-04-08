
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Simple form schema example
const simpleFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// Advanced form schema example
const advancedFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .regex(/^[\d\s+()-]{10,15}$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type SimpleFormValues = z.infer<typeof simpleFormSchema>;
type AdvancedFormValues = z.infer<typeof advancedFormSchema>;

const FormValidationExamples = () => {
  // Simple form
  const simpleForm = useForm<SimpleFormValues>({
    resolver: zodResolver(simpleFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Advanced form
  const advancedForm = useForm<AdvancedFormValues>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
      termsAccepted: false,
    },
  });

  // Form submission handlers
  const onSimpleSubmit = (data: SimpleFormValues) => {
    console.log("Simple form data:", data);
    // In a real app, you'd do something with this data
    simpleForm.reset();
  };

  const onAdvancedSubmit = (data: AdvancedFormValues) => {
    console.log("Advanced form data:", data);
    // In a real app, you'd do something with this data
    advancedForm.reset();
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-heading-sm mb-6">Form Validation with React Hook Form + Zod</h2>
        <div className="prose max-w-none">
          <p>
            Sagebright uses <strong>React Hook Form</strong> paired with <strong>Zod</strong> for form validation.
            This standardized approach ensures consistent validation patterns across the application.
          </p>
          <h3 className="text-subheading-sm mt-4">Implementation Pattern</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Define a Zod schema that describes the form's shape and validation rules</li>
            <li>Initialize the form with React Hook Form's <code>useForm</code> hook</li>
            <li>Use Zod resolver to connect the schema to the form</li>
            <li>Implement form fields with appropriate controls and error display</li>
          </ol>
        </div>
      </section>
      
      <Separator />

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-subheading">Simple Login Form Example</CardTitle>
            <CardDescription>
              Basic email and password validation with Zod
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Form {...simpleForm}>
                  <form onSubmit={simpleForm.handleSubmit(onSimpleSubmit)} className="space-y-6">
                    <FormField
                      control={simpleForm.control}
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
                      control={simpleForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            At least 8 characters long
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>

              <div className="bg-muted p-4 rounded-md overflow-auto">
                <pre className="text-xs">
{`// Define schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// Type inference from schema
type FormValues = z.infer<typeof formSchema>;

// Initialize form with React Hook Form + Zod resolver
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});

// Form submission handler
const onSubmit = (data: FormValues) => {
  // Handle form submission
};`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-subheading">Advanced Contact Form Example</CardTitle>
            <CardDescription>
              Complex validation rules with conditional fields, regex patterns and custom error messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Form {...advancedForm}>
                  <form onSubmit={advancedForm.handleSubmit(onAdvancedSubmit)} className="space-y-6">
                    <FormField
                      control={advancedForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={advancedForm.control}
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
                      control={advancedForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={advancedForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your message here..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={advancedForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the terms and conditions
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>

              <div className="bg-muted p-4 rounded-md overflow-auto">
                <pre className="text-xs">
{`// Advanced form schema with multiple validation rules
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .regex(/^[\\d\\s+()-]{10,15}$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

// Initialize the form with React Hook Form + Zod resolver
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    fullName: "",
    email: "",
    phone: "",
    message: "",
    termsAccepted: false,
  },
});

// Form submission handler
const onSubmit = (data: FormValues) => {
  // Handle form submission
};`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FormValidationExamples;
