
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
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
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo variant="full" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 hover:scale-[1.03]">
              Why{" "} <span className="text-sagebright-green">sagebright</span>
            </a>
            <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 hover:scale-[1.03]">
              How {" "}  <span className="text-sagebright-green">sagebright</span> {" "} Works
            </a>
            <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 hover:scale-[1.03]">
              Who We Help
            </a>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-sagebright-green transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="hidden md:block">
            <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform hover:scale-[1.03] hover:shadow-lg hover:brightness-105">
              <a href="#waitlist">Join Beta</a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 animate-fade-in">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-4">
              <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 py-2">
                Why <span className="text-sagebright-green">sagebright</span>
              </a>
              <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 py-2">
                How <span className="text-sagebright-green">sagebright</span> Works
              </a>
              <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-green transition-colors duration-200 py-2">
                Who We Help
              </a>
              <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md w-full mt-2 transition-transform hover:scale-[1.03] hover:shadow-lg hover:brightness-105">
                <a href="#waitlist">Join Beta</a>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
