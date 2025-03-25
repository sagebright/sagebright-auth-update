
import React from 'react';
import Logo from './Logo';
import { Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Check if we're on the alternate page or ask-sage page
  const isAlternatePage = location.pathname.includes('alternate') || location.pathname.includes('ask-sage');
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Logo variant="full" />
            <p className="text-gray-500 mt-2 font-helvetica text-body">
              Personal AI That Feels Like a Part of Your Team
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {isAlternatePage ? (
              // Links for the alternate page and ask-sage page
              <nav className="flex flex-wrap justify-center space-x-6">
                <a href="#employees" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  For Employees
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
                <a href="#admins" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  For HR & Admins
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
                <Link to="/ask-sage" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Ask Sage
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
                <a href="#how" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  How It Works
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
                <a href="#human" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Human Design
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
              </nav>
            ) : (
              // Links for the default page
              <nav className="flex flex-wrap justify-center space-x-6">
                <a href="#why" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Why <span className="text-sagebright-green">sagebright</span>
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
                <a href="#how" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  How <span className="text-sagebright-green">sagebright</span> Works
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
                <a href="#who" className="text-body font-helvetica text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Who We Help
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </a>
              </nav>
            )}
          </div>
        </div>
        
        <Separator className="bg-gray-100 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-helvetica mb-4 md:mb-0">
            &copy; {currentYear} sagebright.ai. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sagebright-green transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
