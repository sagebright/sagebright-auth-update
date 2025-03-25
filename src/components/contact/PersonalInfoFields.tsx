
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

interface PersonalInfoFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ form }) => {
  return (
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
  );
};
