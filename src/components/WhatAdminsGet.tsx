
import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Lightbulb, Mic, Bell } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const WhatAdminsGet = () => {
  const [imageZoomed, setImageZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

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
        
        <div className="mt-16 mx-auto max-w-5xl relative overflow-visible">
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-100">
              <AspectRatio ratio={16/9} className="bg-sagebright-green/5">
                <img 
                  ref={imageRef}
                  data-src="/lovable-uploads/hr-dashboard-screenshot.png" 
                  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
                  alt="HR Dashboard - Onboarding Analytics" 
                  onLoad={handleImageLoad}
                  className={`w-full h-full object-contain transition-transform duration-8000 ease-out zoom-on-load ${imageZoomed ? 'zoomed' : ''} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sagebright-green/40 via-transparent to-transparent"></div>
              </AspectRatio>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-sagebright-coral/10 to-sagebright-green/10 blur-3xl rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default WhatAdminsGet;
