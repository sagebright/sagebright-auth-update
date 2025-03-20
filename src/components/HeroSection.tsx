
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure the animation triggers after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-white to-sagebright-accent/10 overflow-hidden" id="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 animate-fade-in p-text-spacing">
            <h1 className="text-headline-lg font-dmSans font-bold leading-tight mb-6">
              <span className="block text-sagebright-green">Your AI Mentor for</span>
              <span className="block text-sagebright-coral">Seamless Onboarding & Business Growth</span>
            </h1>
            <p className="text-body font-sans p-text-spacing animate-fade-in [animation-delay:200ms] opacity-0">
              Employees don't thrive with checklists. They thrive with guidance. Sagebright is an AI-powered mentor that transforms onboarding into a personalized journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 p-text-spacing animate-fade-in [animation-delay:400ms] opacity-0">
              <a href="#waitlist" className="inline-block w-full sm:w-auto">
                <Button 
                  className="bg-sagebright-coral hover:bg-sagebright-coral/90 hover:shadow-lg hover:shadow-sagebright-coral/30 transition-all text-white px-8 py-6 text-cta font-dmSans rounded-md w-full"
                >
                  Try Sagebright
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how" className="inline-block w-full sm:w-auto">
                <Button variant="outline" className="border-sagebright-coral hover:bg-sagebright-coral/10 text-gray-800 px-8 py-6 text-cta font-dmSans w-full">
                  Learn How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className={`mt-8 relative max-w-5xl mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-100">
            <div className="absolute z-10 top-1/4 left-1/4 w-8 h-8 rounded-full bg-sagebright-green/30 animate-ping [animation-delay:1000ms]"></div>
            <div className="absolute z-10 top-1/2 right-1/4 w-6 h-6 rounded-full bg-sagebright-coral/30 animate-ping [animation-delay:1500ms]"></div>
            <div className="absolute z-10 bottom-1/4 left-1/3 w-7 h-7 rounded-full bg-sagebright-gold/30 animate-ping [animation-delay:2000ms]"></div>
            <img 
              src="/lovable-uploads/sb_dashboard.png" 
              alt="Professional using AI assistant for onboarding" 
              className={`w-full object-cover transition-transform duration-5000 ease-out ${isVisible ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sagebright-green/40 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
