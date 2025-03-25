
import * as z from "zod";

// Form validation schema
export const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  isBetaClient: z.boolean().default(false),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
