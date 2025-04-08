
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { CheckboxField } from "./CheckboxField";
import { TextareaField } from "./TextareaField";
import { SubmitButton } from "./SubmitButton";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { Send } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Derive TypeScript types from the Zod schema
type FormValues = z.infer<typeof formSchema>;

interface ExampleFormProps {
  onComplete?: (data: FormValues) => void;
}

export const ExampleForm: React.FC<ExampleFormProps> = ({ onComplete }) => {
  // Initialize React Hook Form with Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      message: "",
      agreeToTerms: false,
    },
  });

  // Create mock API submission function
  const mockSubmit = async (data: FormValues) => {
    // Simulate API call
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return data;
  };

  // Use our form submission hook
  const { isSubmitting, handleSubmit } = useFormSubmit<FormValues>({
    onSubmit: mockSubmit,
    onSuccess: onComplete,
    successMessage: "Your information has been submitted successfully!",
    errorMessage: "There was an error submitting your information.",
    resetFormOnSuccess: true,
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    await handleSubmit(data, form.reset);
  };

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card md:p-8 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <TextField
              form={form}
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              required
              icon="user"
            />

            <TextField
              form={form}
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              required
              icon="mail"
            />

            <SelectField
              form={form}
              name="role"
              label="Your Role"
              placeholder="Select your role"
              options={roleOptions}
              required
            />

            <TextareaField
              form={form}
              name="message"
              label="Message"
              placeholder="Enter your message"
              required
              rows={5}
            />

            <CheckboxField
              form={form}
              name="agreeToTerms"
              label="I agree to the terms and conditions"
              description="By checking this box, you agree to our Terms of Service and Privacy Policy."
            />
          </div>

          <SubmitButton isSubmitting={isSubmitting} icon={Send}>
            Submit Form
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};
