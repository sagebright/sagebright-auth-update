
import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Lightbulb, Mic, Bell } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

const WhatAdminsGet = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Implement Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imageRef.current) {
          // Replace the src attribute when the image is about to enter the viewport
          imageRef.current.src = imageRef.current.dataset.src || '';
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="py-20 bg-sagebright-green/5" id="admins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-headline font-dmSans font-bold mb-6">Clarity when it counts. Privacy where it matters.</h2>
          <p className="text-body font-sans text-gray-600 mb-12">
            You see how onboarding is landing — what's working across teams, where people may be hesitating, and where they might need more clarity. Sage protects privacy by default, and only surfaces trends or flags when it could improve someone's experience.
          </p>
        </div>
        
        {/* Screenshot Section - Full Width */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transition-transform duration-500 hover:shadow-card-hover">
            <AspectRatio ratio={16/9}>
              <img 
                ref={imageRef}
                data-src="/lovable-uploads/hr-dashboard-screenshot.png" 
                src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
                alt="HR Dashboard - Onboarding Analytics" 
                onLoad={handleImageLoad}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
              />
            </AspectRatio>
            <div className="absolute -z-10 -inset-8 bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full"></div>
          </div>
        </div>
        
        {/* Cards Section - Grid */}
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
