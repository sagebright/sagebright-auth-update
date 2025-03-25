
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  isBetaClient: z.boolean().default(false),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  onSubmitSuccess?: () => void;
};

const ContactForm = ({ onSubmitSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      isBetaClient: false,
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Submit data to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          company: data.company || null,
          is_beta_client: data.isBetaClient,
          message: data.message
        });
      
      if (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Something went wrong",
          description: "Your message could not be sent. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll be in touch soon.",
        duration: 5000,
      });
      
      // Reset form
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        isBetaClient: false,
        message: "",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Your message could not be sent. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="First Name" 
                      className="border-sagebright-accent/30 focus-visible:ring-sagebright-green" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Last Name" 
                      className="border-sagebright-accent/30 focus-visible:ring-sagebright-green" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    className="border-sagebright-accent/30 focus-visible:ring-sagebright-green" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company (Optional) */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Company (optional)" 
                    className="border-sagebright-accent/30 focus-visible:ring-sagebright-green" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Beta Client Checkbox */}
          <FormField
            control={form.control}
            name="isBetaClient"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-sagebright-green data-[state=checked]:border-sagebright-green"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <p className="text-charcoal text-sm">
                    I am a current beta client
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Message Textarea */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="What's on your mind?" 
                    className="min-h-[150px] border-sagebright-accent/30 focus-visible:ring-sagebright-green text-gray-500" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              className="bg-sagebright-green hover:bg-sagebright-green/90 text-white w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
