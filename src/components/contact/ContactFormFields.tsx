
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
