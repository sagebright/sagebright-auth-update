
import React, { useState } from "react";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  placeholder = "••••••••",
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pr-10 font-roboto ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
      <button
        type="button"
        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
