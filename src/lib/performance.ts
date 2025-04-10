
/**
 * Performance monitoring utilities for Sagebright
 * 
 * This file provides lightweight performance monitoring tools
 * that can be used throughout the application.
 * 
 * Future enhancements:
 * - Integration with web-vitals for core metrics
 * - Connection to analytics services
 * - More sophisticated component timing
 */

// Track component render times
export const measureRenderTime = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    };
  }
  
  // In production, return a no-op function
  return () => {};
};

// Track expensive operations
export const measureOperation = (operationName: string, operation: () => any) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    const result = operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] ${operationName} took ${duration.toFixed(2)}ms`);
    return result;
  }
  
  // In production, just run the operation
  return operation();
};

// Custom hook for component performance tracking
export const useComponentPerformance = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${componentName} rendering started`);
    const finishMeasure = measureRenderTime(componentName);
    
    // Return cleanup function to be used in useEffect
    return finishMeasure;
  }
  
  // In production, return a no-op function
  return () => {};
};

/**
 * Web Vitals integration placeholder
 * 
 * To enable web-vitals monitoring:
 * 1. Install web-vitals: npm install web-vitals
 * 2. Uncomment the code below
 * 3. Set up reporting to your analytics service
 */

/*
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getLCP(onPerfEntry); // Largest Contentful Paint
    getFCP(onPerfEntry); // First Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
}
*/

// Performance monitoring documentation
// - For more advanced monitoring, consider integrating:
//   * LogRocket (session replay + performance)
//   * Sentry Performance (error tracking + performance)
//   * New Relic or Datadog (full APM)
