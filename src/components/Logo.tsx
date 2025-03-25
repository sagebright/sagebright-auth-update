
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
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };
  
  const logoImg = (
    <img 
      src={variant === 'icon' || variant === 'text' ? "/lovable-uploads/sb_logo_type.svg" : "/lovable-uploads/sb_logo_type.png"}
      alt="sagebright.ai" 
      className={`${sizeClasses[size]} w-auto`}
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
