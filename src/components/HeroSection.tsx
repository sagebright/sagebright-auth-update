
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-white to-sagebright-accent/10 overflow-hidden" id="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block text-sagebright-green">Your AI Mentor</span>
              <span className="block text-sagebright-navy">for New Hires</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in [animation-delay:200ms] opacity-0">
              Employees don't thrive with checklists. They thrive with guidance. Sagebright is an AI-powered mentor that transforms onboarding into a personalized journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in [animation-delay:400ms] opacity-0">
              <a href="#waitlist" className="inline-block w-full sm:w-auto">
                <Button className="bg-sagebright-green hover:bg-sagebright-green/90 text-white px-8 py-6 text-lg rounded-md w-full">
                  Join the Beta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how" className="inline-block w-full sm:w-auto">
                <Button variant="outline" className="border-sagebright-navy hover:bg-sagebright-navy/10 text-gray-800 px-8 py-6 text-lg w-full">
                  Learn How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 relative max-w-5xl mx-auto animate-fade-in [animation-delay:600ms] opacity-0">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-100">
            <img 
              src="/lovable-uploads/sb_dashboard.png" 
              alt="Professional using AI assistant for onboarding" 
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sagebright-green/40 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-sagebright-navy/10 to-sagebright-green/10 blur-3xl rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
