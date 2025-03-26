
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section className="pt-28 lg:pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-white to-sagebright-accent/5" id="hero" ref={sectionRef}>
      {/* Top Left Blob - Made more prominent with less blur */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FDE1D3]/60 rounded-full filter blur-[50px] -translate-x-1/2 -translate-y-1/3 z-0"></div>
      
      {/* Bottom Right Blob - Made more prominent with less blur */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F2FCE2]/70 rounded-full filter blur-[50px] translate-x-1/4 translate-y-1/4 z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 animate-fade-in p-text-spacing">
            <h1 className="text-4xl sm:text-headline-lg font-dmSans font-bold leading-tight mb-4">
              <span className="block text-sagebright-green">Personal AI That Feels</span>
              <span className="block text-bittersweet">Like Part of Your Team</span>
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

export default HeroSection;
