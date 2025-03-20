
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Set a small delay to ensure the animation triggers after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      clearTimeout(timer);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="pt-32 pb-20 bg-gradient-to-br from-white to-sagebright-accent/10 overflow-hidden section-animate" 
      id="hero"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12 animate-fade-in p-text-spacing text-block">
            <h1 className="text-headline-lg font-dmSans font-bold leading-tight mb-8">
              <span className="block text-sagebright-green">Your AI Mentor for</span>
              <span className="block text-sagebright-coral">Seamless Onboarding & Business Growth</span>
            </h1>
            <p className="text-body font-sans p-text-spacing animate-fade-in [animation-delay:200ms] opacity-0 mb-10">
              Employees don't thrive with checklists. They thrive with guidance. Sagebright is an AI-powered mentor that transforms onboarding into a personalized journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 p-text-spacing animate-fade-in [animation-delay:400ms] opacity-0">
              <a href="#waitlist" className="inline-block w-full sm:w-auto">
                <Button 
                  className="px-8 py-6 text-cta font-dmSans rounded-md w-full hover:scale-[1.03] hover:brightness-105 hover:shadow-lg hover:shadow-sagebright-coral/30 transition-all"
                >
                  Try Sagebright
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how" className="inline-block w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className="px-8 py-6 text-cta font-dmSans w-full hover:scale-[1.03] transition-transform hover:shadow-md"
                >
                  Learn How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className={`mt-16 relative max-w-5xl mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="absolute z-10 top-1/4 left-1/4 w-8 h-8 rounded-full bg-sagebright-green/30 animate-ping [animation-delay:1000ms]"></div>
            <div className="absolute z-10 top-1/2 right-1/4 w-6 h-6 rounded-full bg-sagebright-coral/30 animate-ping [animation-delay:1500ms]"></div>
            <div className="absolute z-10 bottom-1/4 left-1/3 w-7 h-7 rounded-full bg-sagebright-gold/30 animate-ping [animation-delay:2000ms]"></div>
            <img 
              src="/lovable-uploads/sb_dashboard.png" 
              alt="Professional using AI assistant for onboarding" 
              className={`w-full object-cover transition-transform duration-5000 ease-out ${isVisible ? 'scale-[1.08]' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sagebright-navy/30 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
