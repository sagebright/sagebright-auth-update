
import React from 'react';
import Logo from './Logo';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Logo variant="full" />
            <p className="text-gray-500 mt-4 font-sans">Your AI Mentor for New Hires</p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10">
            <nav className="flex flex-wrap justify-center gap-8">
              <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-green">Why {" "} <span className="text-sagebright-green">sagebright</span></a>
              <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-green">How {" "}<span className="text-sagebright-green">sagebright</span> {" "} Works</a>
              <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-green">Who We Help</a>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm font-sans">
          <p>&copy; {currentYear} sagebright.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
