
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AskSageHero = () => {
  return (
    <section className="relative bg-white overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-headline-lg font-dmSans font-bold mb-6">
              <span className="block text-sagebright-green">
                Personal AI That Feels
              </span>
              <span className="block text-sagebright-coral">
                Like a Part of Your Team
              </span>
            </h1>
            <p className="text-body mb-8 font-helvetica text-charcoal/80 max-w-lg">
              Experience onboarding that feels like a conversation—not a checklist. Sage is your AI teammate that understands your company culture and helps new employees thrive from day one.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-sagebright-green hover:bg-sagebright-green/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
                <Link to="/auth/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="border-sagebright-green text-sagebright-green hover:bg-sagebright-green/10 text-cta font-dmSans rounded-md">
                <a href="#learn-more">Learn More</a>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative bg-white rounded-xl shadow-card overflow-hidden">
              <img 
                src="/lovable-uploads/sb_dashboard.png" 
                alt="Sage AI Assistant Dashboard" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-sagebright-accent/20 filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 rounded-full bg-sagebright-green/10 filter blur-3xl opacity-60"></div>
    </section>
  );
};

export default AskSageHero;
