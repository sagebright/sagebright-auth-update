
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  form,
  name,
  label,
  description,
  disabled = false,
  className = "",
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-start space-x-3 space-y-0 ${className}`}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className="data-[state=checked]:bg-sagebright-green data-[state=checked]:border-sagebright-green"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <div className="text-charcoal text-sm font-medium">{label}</div>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
