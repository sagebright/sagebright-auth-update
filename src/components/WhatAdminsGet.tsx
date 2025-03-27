
import React from 'react';
import { BarChart3, Lightbulb, Mic, Bell } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import LazyImage from './ui/lazy-image';

const WhatAdminsGet = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 bg-sagebright-green/5" id="admins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Side-by-side layout with adjusted ratio (40% text, 60% screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-16 items-center">
          {/* Left column - Text content (appears on right) */}
          <div className="flex flex-col justify-center md:col-span-2 md:order-2">
            <h2 className="text-headline font-dmSans font-bold mb-6">Clarity when it counts. Privacy where it matters.</h2>
            <p className="text-body font-sans text-gray-600">
              You see how onboarding is landing — what's working across teams, where people may be hesitating, and where they might need more clarity. Sage protects privacy by default, and only surfaces trends or flags when it could improve someone's experience.
            </p>
          </div>
          
          {/* Right column - Screenshot (appears on left with 60% width) */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transition-transform duration-500 hover:shadow-card-hover md:col-span-3 md:order-1">
            <LazyImage 
              src="/lovable-uploads/hr-dashboard-screenshot.webp" 
              alt="HR Dashboard - Onboarding Analytics"
              aspectRatio="16/9"
              placeholderColor="#f0f4f7"
              objectFit="contain"
            />
            <div className="absolute -z-10 -inset-8 bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full"></div>
          </div>
        </div>
        
        {/* Cards Section - Grid below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <BarChart3 className="h-6 w-6 text-sagebright-coral" />
            </div>
            <h3 className="text-lg font-dmSans font-semibold mb-3">Dashboard: onboarding progress, milestones, drop-off points</h3>
            <p className="text-gray-600 font-sans text-sm">
              Get insights into how employees move through onboarding, including where they may need additional support.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Lightbulb className="h-6 w-6 text-sagebright-coral" />
            </div>
            <h3 className="text-lg font-dmSans font-semibold mb-3">Aggregated sentiment trends — with employee privacy protected</h3>
            <p className="text-gray-600 font-sans text-sm">
              Understand how teams are feeling without compromising individual privacy or creating uncomfortable dynamics.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Mic className="h-6 w-6 text-sagebright-coral" />
            </div>
            <h3 className="text-lg font-dmSans font-semibold mb-3">Insights into where your onboarding content feels clear — and where it needs work</h3>
            <p className="text-gray-600 font-sans text-sm">
              Discover which resources resonate with new employees and which might need revision or additional context.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Bell className="h-6 w-6 text-sagebright-coral" />
            </div>
            <h3 className="text-lg font-dmSans font-semibold mb-3">Optional nudges when an employee flags confusion or requests support</h3>
            <p className="text-gray-600 font-sans text-sm">
              Receive alerts only when needed, helping you provide timely support without micromanaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatAdminsGet;
