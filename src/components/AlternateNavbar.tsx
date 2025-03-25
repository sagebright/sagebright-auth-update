
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AlternateNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  useEffect(() => {
    let scrollTimer: number;
    const throttledScroll = () => {
      if (!scrollTimer) {
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          handleScroll();
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  const isActive = (path: string) => {
    return location.hash === path;
  };

  const isContactPage = location.pathname === '/contact-us';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
    } border-b border-gray-100`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo variant="full" />
          </div>
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            {isContactPage ? (
              // If on contact page, link to sections on index page
              <>
                <Link 
                  to="/#employees" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  For Employees
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#admins" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  For HR & Admins
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#how" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  How It Works
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#human" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  Human Design
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </>
            ) : (
              // On index page, use anchor tags for smooth scrolling
              <>
                <a 
                  href="#employees" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#employees') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  For Employees
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#employees') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#admins" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#admins') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  For HR & Admins
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#admins') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#how" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#how') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  How It Works
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#how') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#human" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#human') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  Human Design
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#human') ? 'scale-x-100' : ''}`}></span>
                </a>
              </>
            )}
            <Link 
              to="/contact-us" 
              className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
            >
              Contact Us
              <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
              <Link to="/auth/signup">Request Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AlternateNavbar;
