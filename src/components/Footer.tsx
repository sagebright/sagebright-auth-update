
import React from 'react';
import Logo from './Logo';
import { Separator } from '@/components/ui/separator';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Check if we're on the index-v1 page
  const isIndexV1Page = location.pathname.includes('index-v1');
  const isContactPage = location.pathname === '/contact-us';
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Logo variant="full" size="lg" />
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            {isIndexV1Page ? (
              // Links for the index-v1 page
              <nav className="flex flex-wrap justify-center space-x-6">
                <a href="#why" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Why <span className="text-sagebright-green">sagebright</span>
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#how" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  How <span className="text-sagebright-green">sagebright</span> Works
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#who" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Who We Help
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <Link to="/contact-us" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Contact Us
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </nav>
            ) : isContactPage ? (
              // Links for the contact page (linking back to index sections)
              <nav className="flex flex-wrap justify-center space-x-6">
                <Link to="/#employees" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Meet Sage
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link to="/#admins" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Built for Teams
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link to="/#how" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  From Intro to Impact
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link to="/#human" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Designed for People
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link to="/contact-us" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Contact Us
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </nav>
            ) : (
              // Links for the main index page
              <nav className="flex flex-wrap justify-center space-x-6">
                <a href="#employees" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Meet Sage
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#admins" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Built for Teams
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#how" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  From Intro to Impact
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#human" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Designed for People
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <Link to="/contact-us" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Contact Us
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </nav>
            )}
          </div>
        </div>
        
        <Separator className="bg-gray-100 my-6" />
        
        <div className="flex justify-center items-center">
          <p className="text-gray-500 text-sm font-helvetica text-center">
            &copy; {currentYear} sagebright.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
