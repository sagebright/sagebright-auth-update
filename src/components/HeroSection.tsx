
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden" id="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative w-full max-w-md h-64 mb-8">
              <img src="/lovable-uploads/work group.png?auto=format&fit=crop&w=800&q=80" 
              alt="Professional using AI assistant for onboarding" 
              className="rounded-lg object-cover w-full h-full shadow-lg filter contrast-[1.2] saturate-[1.3] brightness-[0.9]"
  />
  
  {/* Overlay for More Pronounced Filtering */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-lg"></div>
      </div>
          </div>   
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            <span className="block text-sagebright-green">Your AI Mentor</span>
            <span className="block text-sagebright-gold">for New Hires</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in [animation-delay:200ms] opacity-0">
            Employees don't thrive with checklists. They thrive with guidance. {" "}
            <span className="text-sagebright-green">sage</span>
            <span className="text-sagebright-gold">bright</span> is an AI-powered mentor that transforms onboarding into a personalized journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in [animation-delay:400ms] opacity-0">
            <Button asChild className="bg-sagebright-green hover:bg-sagebright-green/90 text-white px-8 py-6 text-lg">
              <a href="#waitlist">
                Join the Beta
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-sagebright-gold hover:bg-sagebright-gold/10 text-gray-800 px-8 py-6 text-lg">
              <a href="#how">Learn How It Works</a>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 relative max-w-4xl mx-auto animate-fade-in [animation-delay:600ms] opacity-0">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-center px-4">Product screenshot will appear here</p>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-sagebright-gold/20 to-sagebright-green/20 blur-3xl rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
