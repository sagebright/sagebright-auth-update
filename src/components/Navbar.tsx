
import React from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo variant="full" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#why" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200 font-medium">
              Why{" "} <span className="text-sagebright-green">sage</span>
            <span className="text-sagebright-gold">bright</span>
            </a>
            <a href="#how" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200 font-medium">
              How {" "}  <span className="text-sagebright-green">sage</span>
            <span className="text-sagebright-gold">bright</span> {" "} Works
            </a>
            <a href="#who" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200 font-medium">
              Who We Help
            </a>
          </nav>
          <div>
            <Button asChild className="bg-sagebright-green hover:bg-sagebright-green/90 text-white rounded-md">
              <a href="#waitlist">Join Beta</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
