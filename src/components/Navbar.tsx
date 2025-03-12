
import React from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo variant="full" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#why" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              Why
            </a>
            <a href="#how" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              How It Works
            </a>
            <a href="#who" className="text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              Who It's For
            </a>
          </nav>
          <div>
            <Button asChild className="bg-sagebright-green hover:bg-sagebright-green/90 text-white">
              <a href="#waitlist">Join Beta</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
