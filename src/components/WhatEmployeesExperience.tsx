
import React, { useState, useRef, useEffect } from 'react';
import { Target, Brain, MessageSquare } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const WhatEmployeesExperience = () => {
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
    <section className="py-20 bg-white" id="employees">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-headline font-dmSans font-bold mb-6">Onboarding that feels like a conversation — not a checklist.</h2>
          <p className="text-body font-sans text-gray-600">
            Sage acts like a helpful teammate who never gets tired of answering questions. It's always available, always personal, and always grounded in your company's unique values, tone, and expertise.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:gap-12 mb-12">
          {/* Cards Column - 7 columns on desktop */}
          <div className="w-full lg:w-7/12 lg:pr-6 mb-8 lg:mb-0">
            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <Target className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Helps new hires prioritize what matters most</h3>
                <p className="text-gray-600 font-sans">
                  Sage helps employees focus on what's important right now, ensuring they don't get overwhelmed by too much information at once.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <Brain className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Answers questions using your tools, resources, and knowledge bases</h3>
                <p className="text-gray-600 font-sans">
                  Sage connects to your existing knowledge resources to provide accurate, company-specific answers to employee questions.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <MessageSquare className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Encourages honest reflections — and empowers employees to share what's working</h3>
                <p className="text-gray-600 font-sans">
                  Sage creates a safe space for feedback, helping new hires voice concerns and share insights on their own terms.
                </p>
              </div>
            </div>
          </div>
          
          {/* Screenshot Column - 5 columns on desktop */}
          <div className="w-full lg:w-5/12 lg:pl-6 flex items-center">
            <div className="relative w-full overflow-visible">
              <div className="w-full flex justify-center items-center">
                <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-100">
                  <AspectRatio ratio={16/9}>
                    <img 
                      ref={imageRef}
                      data-src="/lovable-uploads/ask-sage-screenshot.png" 
                      src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
                      alt="Ask Sage Interface - AI Assistant for Onboarding" 
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
        </div>
      </div>
    </section>
  );
};

export default WhatEmployeesExperience;
