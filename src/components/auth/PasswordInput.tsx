
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  placeholder?: string;
  name: string;
  id: string;
  className?: string;
  required?: boolean;
  'aria-required'?: boolean | string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = 'Enter your password',
  name,
  id,
  className = '',
  required,
  'aria-required': ariaRequired,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Convert aria-required to boolean for proper typing
  const ariaRequiredValue = ariaRequired === 'true' || ariaRequired === true;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // For debugging
  console.log(`Rendering PasswordInput with id: ${id}`, {
    ariaRequired: ariaRequiredValue
  });

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`pr-10 bg-white ${className}`}
        required={required}
        aria-required={ariaRequiredValue}
        autoComplete="current-password"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={togglePasswordVisibility}
        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInput;
