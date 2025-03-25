
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AlternateHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure the animation triggers after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-white to-sagebright-accent/10 overflow-hidden" id="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="mb-8 animate-fade-in p-text-spacing">
            <h1 className="text-headline-lg font-dmSans font-bold leading-tight mb-6">
              <span className="block text-sagebright-green whitespace-nowrap md:whitespace-normal">Personal AI That Feels</span>
              <span className="block text-sagebright-coral whitespace-nowrap md:whitespace-normal">Like a Part of Your Team</span>
            </h1>
            <p className="text-body font-sans p-text-spacing animate-fade-in [animation-delay:200ms] opacity-0">
              Sagebright gives every new hire a guide who understands your company, culture, and tools — and helps them get what they need to thrive. It's onboarding that feels personal, intuitive, and built for humans.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 p-text-spacing animate-fade-in [animation-delay:400ms] opacity-0">
              <a href="#waitlist" className="inline-block w-full sm:w-auto">
                <Button 
                  className="bg-sagebright-coral hover:bg-sagebright-coral/90 hover:shadow-lg hover:shadow-sagebright-coral/30 transition-all text-white px-8 py-6 text-cta font-dmSans rounded-md w-full hover:scale-103 hover:brightness-105"
                >
                  Try Sagebright
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how" className="inline-block w-full sm:w-auto">
                <Button variant="outline" className="border-sagebright-coral hover:bg-sagebright-coral/10 text-gray-800 px-8 py-6 text-cta font-dmSans w-full hover:scale-103">
                  Learn How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlternateHeroSection;
