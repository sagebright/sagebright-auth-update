
import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, User, Search, AlertCircle } from "lucide-react";

type IconType = "mail" | "user" | "search" | "none";

interface TextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: IconType;
}

const iconsMap = {
  mail: Mail,
  user: User,
  search: Search,
  none: null,
};

export const TextField: React.FC<TextFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  icon = "none",
}) => {
  const IconComponent = icon !== "none" ? iconsMap[icon] : null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="font-helvetica">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {IconComponent && (
                <IconComponent className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              )}
              <Input
                placeholder={placeholder}
                className={`${
                  IconComponent ? "pl-10" : ""
                } font-roboto border-sagebright-accent/30 focus-visible:ring-sagebright-green`}
                disabled={disabled}
                {...field}
              />
              {fieldState.error && (
                <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-destructive" />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
