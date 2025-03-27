import React from 'react';
import { Compass, CircleUser, Handshake, FilePen } from 'lucide-react';
import LazyImage from './ui/lazy-image';

const DesignedToFeelHuman = () => {
  return (
    <section className="py-20 bg-sagebright-green/5" id="human">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Side-by-side layout with adjusted ratio (40% text, 60% screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-16 items-center">
          {/* Left column - Text content (40%) */}
          <div className="flex flex-col justify-center md:col-span-2">
            <h2 className="text-headline font-dmSans font-bold mb-6">An AI that doesn't feel like AI.</h2>
            <p className="text-body font-sans text-gray-600">
              Sage isn't a bot that throws articles at you. It's a conversational guide that feels human — because it's built with intention, voice, and empathy from day one.
            </p>
          </div>
          
          {/* Right column - Screenshot (60%) */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transition-transform duration-500 hover:shadow-card-hover md:col-span-3">
            <LazyImage 
              src="/lovable-uploads/ask-sage-screenshot.webp" 
              alt="Ask Sage Interface - AI Assistant for Onboarding"
              aspectRatio="4/3"
              placeholderColor="#f0f7f4"
            />
            
            {/* Decorative background */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-sagebright-coral/5 to-sagebright-green/5 blur-2xl rounded-full"></div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex">
            <div className="mr-6">
              <div className="bg-sagebright-gold/20 w-14 h-14 flex items-center justify-center rounded-full">
                <Compass className="h-7 w-7 text-sagebright-navy" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-dmSans font-semibold mb-3">Personal guidance {`>`} generic automation</h3>
              <p className="text-gray-600 font-sans">
                Sage tailors its approach to each employee, offering guidance that feels conversational and relevant.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex">
            <div className="mr-6">
              <div className="bg-sagebright-gold/20 w-14 h-14 flex items-center justify-center rounded-full">
                <CircleUser className="h-7 w-7 text-sagebright-navy" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-dmSans font-semibold mb-3">Reflects your values and culture</h3>
              <p className="text-gray-600 font-sans">
                Sage embodies your company's unique voice and values, creating a consistent extension of your culture.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex">
            <div className="mr-6">
              <div className="bg-sagebright-gold/20 w-14 h-14 flex items-center justify-center rounded-full">
                <Handshake className="h-7 w-7 text-sagebright-navy" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-dmSans font-semibold mb-3">Keeps new hires moving forward — without getting stuck</h3>
              <p className="text-gray-600 font-sans">
                Sage provides just-in-time support, reducing friction and helping employees maintain momentum.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex">
            <div className="mr-6">
              <div className="bg-sagebright-gold/20 w-14 h-14 flex items-center justify-center rounded-full">
                <FilePen className="h-7 w-7 text-sagebright-navy" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-dmSans font-semibold mb-3">Learns and grows with your company</h3>
              <p className="text-gray-600 font-sans">
                Sage evolves alongside your organization, adapting as your culture, tools, and people change over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignedToFeelHuman;
