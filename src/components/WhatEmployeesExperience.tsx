
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
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
          
          {/* Right Column - Screenshot */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500">
              <AspectRatio ratio={4/3}>
                <img 
                  ref={imageRef}
                  data-src="/lovable-uploads/ask-sage-screenshot.png" 
                  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
                  alt="Ask Sage Interface - AI Assistant for Onboarding" 
                  onLoad={handleImageLoad}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                />
              </AspectRatio>
              
              {/* Connection lines to visually connect screenshot with cards */}
              <div className="absolute -left-4 top-1/4 w-4 h-[2px] bg-sagebright-green/30 hidden lg:block"></div>
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-sagebright-green/30 hidden lg:block"></div>
              <div className="absolute -left-4 top-3/4 w-4 h-[2px] bg-sagebright-green/30 hidden lg:block"></div>
            </div>
            
            {/* Decorative background */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-sagebright-coral/5 to-sagebright-green/5 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatEmployeesExperience;
