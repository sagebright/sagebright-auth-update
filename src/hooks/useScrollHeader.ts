
import { useState, useEffect, useCallback } from 'react';

interface ScrollHeaderProps {
  threshold?: number;
  throttleTime?: number;
}

/**
 * Custom hook to handle header appearance changes on scroll
 * @param threshold Number of pixels to scroll before applying styles
 * @param throttleTime Time in ms to throttle scroll events
 * @returns Object with scrolled state
 */
export const useScrollHeader = ({ 
  threshold = 20, 
  throttleTime = 100 
}: ScrollHeaderProps = {}) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > threshold;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled, threshold]);

  useEffect(() => {
    let scrollTimer: number;
    const throttledScroll = () => {
      if (!scrollTimer) {
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          handleScroll();
        }, throttleTime);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll, throttleTime]);

  return { scrolled };
};
