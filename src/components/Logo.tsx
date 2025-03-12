
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo = ({ variant = 'full', className = '' }: LogoProps) => {
  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src="/lovable-uploads/sb_logo_type.svg" 
          alt="sagebright.ai logo" 
          className="h-48 w-auto"
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
          className="h-6 w-auto"
        />
      </div>
    );
  }
  
  // Default is full logo (icon + text)
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/9c5a4498-dc40-4128-a24d-b4f4737493cf.png" 
        alt="sagebright.ai" 
        className="h-8 w-auto"
      />
    </div>
  );
};

export default Logo;
