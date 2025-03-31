
import React from 'react';
import { Link } from 'react-router-dom';

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
    sm: 'h-8',  // Increased from h-6 to h-8 for consistency
    md: 'h-12', // Increased from h-8 to h-12 for consistency
    lg: 'h-12',
    xl: 'h-16'
  };
  
  // For SVG rendering, we'll use PNG formats to avoid rendering artifacts
  const logoImg = (
    <img 
      src={variant === 'icon' 
        ? "/lovable-uploads/sb_logo.png" 
        : "/lovable-uploads/sb_logo_type.png"}
      alt="sagebright.ai" 
      className={`${sizeClasses[size]} w-auto`}
      style={{ imageRendering: 'auto' }}
    />
  );
  
  return (
    <div className={`flex items-center ${className}`}>
      <Link to="/">
        {logoImg}
      </Link>
    </div>
  );
};

export default Logo;
