
import React, { useState, useEffect } from 'react';
import LazyImage from './LazyImage';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo = ({ variant = 'full', className = '' }: LogoProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render the logo when component is mounted (client-side)
  if (!mounted) return null;
  
  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <LazyImage 
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
        <LazyImage 
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
      <LazyImage 
        src="/lovable-uploads/sb_logo_type.png" 
        alt="sagebright.ai" 
        className="h-12 w-auto"
      />
    </div>
  );
};

export default Logo;
