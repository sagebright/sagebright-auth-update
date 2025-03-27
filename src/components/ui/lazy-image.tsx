
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  aspectRatio = '16/9',
  objectFit = 'cover' // Changed default from 'contain' to 'cover'
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        console.log(`Container dimensions for ${alt}: ${width}px × ${height}px`);
      }
    };
    
    // Initial measurement
    updateDimensions();
    
    // Listen for resize events
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [alt, isLoaded]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden" 
      style={{ aspectRatio, backgroundColor: placeholderColor }}
    >
      {/* Low-quality placeholder */}
      <div 
        className={`absolute inset-0 bg-gray-100 animate-pulse ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.3s ease' }}
      />
      
      <img
        ref={imageRef}
        src={inView ? src : ''}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectFit }}
      />
      
      {/* Dimensions overlay for development (remove in production) */}
      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 m-2 rounded">
        {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
      </div>
    </div>
  );
};

export default LazyImage;
