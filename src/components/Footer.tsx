
import React from 'react';
import Logo from './Logo';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo variant="full" />
            <p className="text-gray-500 mt-2 font-sans">Your AI Mentor for New Hires</p>
          </div>

          
         <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          {/*
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
              <a 
                href="https://bsky.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sagebright-green transition-colors"
                aria-label="Bluesky"
               >
               <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                 <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM17.001 14.25C17.001 14.6642 16.6652 15 16.251 15H7.75098C7.33676 15 7.00098 14.6642 7.00098 14.25V13.9123L11.251 9.66225L13.4385 11.8497C13.6338 12.045 13.9507 12.045 14.146 11.8497C14.3413 11.6544 14.3413 11.3376 14.146 11.1422L11.6047 8.60096C11.4094 8.4056 11.0925 8.4056 10.8972 8.60096L7.00098 12.497V9.75C7.00098 9.33579 7.33676 9 7.75098 9H16.251C16.6652 9 17.001 9.33579 17.001 9.75V14.25Z" />
               </svg>
             </a>
           </div>
           */} 
            <nav className="flex flex-wrap justify-center space-x-6">
              <a href="#why" className="text-body font-sans text-gray-600 hover:text-sagebright-green">Why {" "} <span className="text-sagebright-green">sagebright</span></a>
              <a href="#how" className="text-body font-sans text-gray-600 hover:text-sagebright-green">How {" "}<span className="text-sagebright-green">sagebright</span> {" "} Works</a>
              <a href="#who" className="text-body font-sans text-gray-600 hover:text-sagebright-green">Who We Help</a>
              {/* <a href="#waitlist" className="text-gray-600 hover:text-sagebright-green">Join Beta</a> */}
            </nav>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm font-sans">
          <p>&copy; {currentYear} sagebright.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
