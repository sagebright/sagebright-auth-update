
import React from 'react';
import { BarChart3, Lightbulb, Mic, Bell } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const WhatAdminsGet = () => {
  return (
    <section className="py-20 bg-sagebright-green/5" id="admins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-headline font-dmSans font-bold mb-6">Clarity when it counts. Privacy where it matters.</h2>
          <p className="text-body font-sans text-gray-600">
            You see how onboarding is landing — what's working across teams, where people may be hesitating, and where they might need more clarity. Sage protects privacy by default, and only surfaces trends or flags when it could improve someone's experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
        
        <div className="mt-16 mx-auto max-w-4xl rounded-xl overflow-hidden shadow-xl">
          <AspectRatio ratio={16/9} className="bg-sagebright-green/5">
            <img 
              src="/lovable-uploads/hr-dashboard-screenshot.png" 
              alt="HR Dashboard - Onboarding Analytics" 
              className="w-full h-full object-cover rounded-xl"
            />
          </AspectRatio>
          <div className="bg-white p-4 text-center">
            <p className="text-charcoal text-sm font-medium">Track onboarding performance and identify areas for improvement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatAdminsGet;
