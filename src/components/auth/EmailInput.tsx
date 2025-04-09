
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailInputProps {
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  placeholder = "you@example.com",
  className = "",
}) => {
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        type="email"
        placeholder={placeholder}
        className={`pl-10 font-roboto ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
};

export default EmailInput;
