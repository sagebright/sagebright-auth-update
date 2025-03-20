
import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  webpSrc?: string;
}

const LazyImage = ({ src, alt, className = '', placeholderColor = '#f3f4f6', webpSrc }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Create an intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading when image is 100px from viewport
        threshold: 0.01,
      }
    );

    // Start observing the image container
    const imageElement = document.getElementById(`lazy-image-${alt.replace(/\s+/g, '-')}`);
    if (imageElement) {
      observer.observe(imageElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [alt]);

  return (
    <div 
      id={`lazy-image-${alt.replace(/\s+/g, '-')}`}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {isInView && (
        <picture>
          {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </picture>
      )}
    </div>
  );
};

export default LazyImage;
