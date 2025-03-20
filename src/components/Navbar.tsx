
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
    } border-b border-gray-100`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-24">
          <Logo variant="full" />
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              Why{" "} <span className="text-sagebright-green">sagebright</span>
            </a>
            <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              How {" "}  <span className="text-sagebright-green">sagebright</span> {" "} Works
            </a>
            <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200">
              Who We Help
            </a>
          </nav>
          <div>
            <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
              <a href="#waitlist">Join Beta</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
