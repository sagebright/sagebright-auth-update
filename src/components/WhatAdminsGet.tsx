
import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Lightbulb, Mic, Bell } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

const WhatAdminsGet = () => {
  const [imageZoomed, setImageZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set a small delay to ensure the animation triggers after component mount
    const timer = setTimeout(() => {
      setImageZoomed(true);
    }, 100);
    
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
      clearTimeout(timer);
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-headline font-dmSans font-bold mb-6">Clarity when it counts. Privacy where it matters.</h2>
          <p className="text-body font-sans text-gray-600">
            You see how onboarding is landing — what's working across teams, where people may be hesitating, and where they might need more clarity. Sage protects privacy by default, and only surfaces trends or flags when it could improve someone's experience.
          </p>
        </div>
        
        {/* Desktop Layout (Image in center, cards surrounding) */}
        <div className="hidden lg:block relative">
          {/* Center Screenshot */}
          <div className="mx-auto w-[55%] relative z-10 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500">
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
            </div>
            <div className="absolute -z-10 -inset-8 bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full"></div>
          </div>
          
          {/* Cards arranged in a grid around the image */}
          <div className="grid grid-cols-2 gap-8 -mt-6">
            {/* Top Row */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <BarChart3 className="h-6 w-6 text-sagebright-coral" />
              </div>
              <h3 className="text-lg font-dmSans font-semibold mb-3">Dashboard: onboarding progress, milestones, drop-off points</h3>
              <p className="text-gray-600 font-sans text-sm">
                Get insights into how employees move through onboarding, including where they may need additional support.
              </p>
              <div className="absolute bottom-0 right-1/4 w-[2px] h-8 bg-sagebright-coral/20"></div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Lightbulb className="h-6 w-6 text-sagebright-coral" />
              </div>
              <h3 className="text-lg font-dmSans font-semibold mb-3">Aggregated sentiment trends — with employee privacy protected</h3>
              <p className="text-gray-600 font-sans text-sm">
                Understand how teams are feeling without compromising individual privacy or creating uncomfortable dynamics.
              </p>
              <div className="absolute bottom-0 left-1/4 w-[2px] h-8 bg-sagebright-coral/20"></div>
            </div>
            
            {/* Bottom Row */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 transform hover:translate-y-1 transition-transform duration-300">
              <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Mic className="h-6 w-6 text-sagebright-coral" />
              </div>
              <h3 className="text-lg font-dmSans font-semibold mb-3">Insights into where your onboarding content feels clear — and where it needs work</h3>
              <p className="text-gray-600 font-sans text-sm">
                Discover which resources resonate with new employees and which might need revision or additional context.
              </p>
              <div className="absolute top-0 right-1/4 w-[2px] h-8 bg-sagebright-coral/20"></div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 transform hover:translate-y-1 transition-transform duration-300">
              <div className="bg-sagebright-coral/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Bell className="h-6 w-6 text-sagebright-coral" />
              </div>
              <h3 className="text-lg font-dmSans font-semibold mb-3">Optional nudges when an employee flags confusion or requests support</h3>
              <p className="text-gray-600 font-sans text-sm">
                Receive alerts only when needed, helping you provide timely support without micromanaging.
              </p>
              <div className="absolute top-0 left-1/4 w-[2px] h-8 bg-sagebright-coral/20"></div>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout (Stacked) */}
        <div className="lg:hidden space-y-8">
          {/* Screenshot first on mobile */}
          <div className="relative mb-8">
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-100">
              <AspectRatio ratio={16/9}>
                <img 
                  data-src="/lovable-uploads/hr-dashboard-screenshot.png" 
                  src={imageLoaded ? "/lovable-uploads/hr-dashboard-screenshot.png" : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
                  alt="HR Dashboard - Onboarding Analytics" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </AspectRatio>
            </div>
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-2xl rounded-full"></div>
          </div>
          
          {/* Cards stacked on mobile */}
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
