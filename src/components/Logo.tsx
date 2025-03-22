
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo = ({ 
  variant = 'full', 
  className = '',
  size = 'md'
}: LogoProps) => {
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };
  
  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src="/lovable-uploads/sb_logo_type.svg" 
          alt="sagebright.ai logo" 
          className={`${sizeClasses[size]} w-auto`}
        />
      </div>
    );
  }
  
  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src="/lovable-uploads/sb_logo_type.svg" 
          alt="sagebright.ai" 
          className={`${sizeClasses[size]} w-auto`}
        />
      </div>
    );
  }
  
  // Default is full logo (icon + text)
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/sb_logo_type.png" 
        alt="sagebright.ai" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;
