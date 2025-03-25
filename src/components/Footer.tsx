
import React from 'react';
import Logo from './Logo';
import { Separator } from '@/components/ui/separator';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Check if we're on the index-v1 page
  const isIndexV1Page = location.pathname.includes('index-v1');
  
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
            ) : (
              // Links for the main index page (former alternate)
              <nav className="flex flex-wrap justify-center space-x-6">
                <a href="#employees" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  For Employees
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#admins" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  For HR & Admins
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#how" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  How It Works
                  <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
                <a href="#human" className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group">
                  Human Design
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
