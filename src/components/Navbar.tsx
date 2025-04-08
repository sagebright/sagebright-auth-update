
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const isContactPage = location.pathname === '/contact-us';

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
    } border-b border-gray-100`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo variant="full" size="md" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            {isContactPage ? (
              <>
                <Link 
                  to="/#employees" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  Meet Sage
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#admins" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  Built for Teams
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#how" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  From Intro to Impact
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/#human" 
                  className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
                >
                  Designed for People
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </>
            ) : (
              <>
                <a 
                  href="#employees" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#employees') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  Meet Sage
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#employees') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#admins" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#admins') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  Built for Teams
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#admins') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#how" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#how') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  From Intro to Impact
                  <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#how') ? 'scale-x-100' : ''}`}></span>
                </a>
                <a 
                  href="#human" 
                  className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#human') ? 'font-medium text-sagebright-green' : ''}`}
                >
                  Designed for People
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
          
          <div className="flex items-center ml-6 md:ml-8">
            <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
              <Link to={user ? "/user-dashboard" : "/auth/login"}>
                {user ? "Dashboard" : "Request Access"}
              </Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[350px] pt-12">
                  <div className="flex flex-col gap-6 py-4">
                    {isContactPage ? (
                      <>
                        <Link 
                          to="/#employees" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Meet Sage
                        </Link>
                        <Link 
                          to="/#admins" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Built for Teams
                        </Link>
                        <Link 
                          to="/#how" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          From Intro to Impact
                        </Link>
                        <Link 
                          to="/#human" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Designed for People
                        </Link>
                      </>
                    ) : (
                      <>
                        <a 
                          href="#employees" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Meet Sage
                        </a>
                        <a 
                          href="#admins" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Built for Teams
                        </a>
                        <a 
                          href="#how" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          From Intro to Impact
                        </a>
                        <a 
                          href="#human" 
                          className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                        >
                          Designed for People
                        </a>
                      </>
                    )}
                    <Link 
                      to="/contact-us" 
                      className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
                    >
                      Contact Us
                    </Link>
                    <div className="pt-4">
                      <Button asChild className="w-full bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md">
                        <Link to={user ? "/user-dashboard" : "/auth/login"}>
                          {user ? "Dashboard" : "Request Access"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
