
/**
 * Sagebright Animation System
 * 
 * This file defines keyframes, transitions, and animation utilities
 * used across the application.
 */

export const animations = {
  keyframes: {
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    'fade-in': {
      '0%': {
        opacity: '0',
        transform: 'translateY(10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateY(0)'
      }
    }
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'fade-in': 'fade-in 0.5s ease-out forwards',
    'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
  },
  transitionDuration: {
    '5000': '5000ms',
    '8000': '8000ms',
  },
  scale: {
    '103': '1.03',
  },
  brightness: {
    '105': '1.05',
  },
};
