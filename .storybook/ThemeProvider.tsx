
import React from 'react';
import { useEffect, useState } from 'react';

export const ThemeProvider = ({ 
  children, 
  theme = 'light' 
}: { 
  children: React.ReactNode;
  theme?: 'light' | 'dark' 
}) => {
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    return () => {
      // Clean up - remove dark class when component unmounts
      if (theme === 'dark') {
        root.classList.remove('dark');
      }
    };
  }, [theme]);
  
  return <>{children}</>;
};
