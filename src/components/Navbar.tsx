
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo variant="full" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors duration-200 hover:scale-[1.03] border-b-2 border-transparent hover:border-sagebright-gold">
              Why{" "} <span className="text-sagebright-green">sagebright</span>
            </a>
            <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors duration-200 hover:scale-[1.03] border-b-2 border-transparent hover:border-sagebright-gold">
              How {" "}  <span className="text-sagebright-green">sagebright</span> {" "} Works
            </a>
            <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors duration-200 hover:scale-[1.03] border-b-2 border-transparent hover:border-sagebright-gold">
              Who We Help
            </a>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-sagebright-navy"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          <div className="hidden md:block">
            <Button asChild className="text-cta font-dmSans rounded-md transition-transform hover:scale-[1.03] hover:shadow-lg hover:brightness-105">
              <a href="#waitlist">Join Beta</a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Improved animation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-6">
              <a 
                href="#why" 
                className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors px-4 py-3 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why <span className="text-sagebright-green">sagebright</span>
              </a>
              <a 
                href="#how" 
                className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors px-4 py-3 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                How <span className="text-sagebright-green">sagebright</span> Works
              </a>
              <a 
                href="#who" 
                className="text-body font-sans text-gray-600 hover:text-sagebright-navy transition-colors px-4 py-3 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Who We Help
              </a>
              <Button 
                asChild 
                className="text-cta font-dmSans rounded-md w-full mt-2 transition-transform hover:scale-[1.03] hover:shadow-lg hover:brightness-105"
                onClick={() => setMobileMenuOpen(false)}
              >
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
