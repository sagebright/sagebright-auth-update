
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ContactInfoFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
