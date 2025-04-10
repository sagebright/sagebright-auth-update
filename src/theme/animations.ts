
/**
 * Sagebright Animation System
 * 
 * This file defines keyframes, transitions, and animation utilities
 * used across the application.
 */

export const animations = {
  keyframes: {
    // UI component animations
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    
    // Fade animations
    'fade-in': {
      '0%': {
        opacity: '0',
        transform: 'translateY(10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateY(0)'
      }
    },
    'fade-out': {
      '0%': {
        opacity: '1',
        transform: 'translateY(0)'
      },
      '100%': {
        opacity: '0',
        transform: 'translateY(10px)'
      }
    },
    
    // Scale animations
    'scale-in': {
      '0%': {
        opacity: '0',
        transform: 'scale(0.95)'
      },
      '100%': {
        opacity: '1',
        transform: 'scale(1)'
      }
    },
    'scale-out': {
      '0%': {
        opacity: '1',
        transform: 'scale(1)'
      },
      '100%': {
        opacity: '0',
        transform: 'scale(0.95)'
      }
    },
    
    // Slide animations
    'slide-in-right': {
      '0%': {
        transform: 'translateX(100%)'
      },
      '100%': {
        transform: 'translateX(0)'
      }
    },
    'slide-out-right': {
      '0%': {
        transform: 'translateX(0)'
      },
      '100%': {
        transform: 'translateX(100%)'
      }
    },
    'slide-in-left': {
      '0%': {
        transform: 'translateX(-100%)'
      },
      '100%': {
        transform: 'translateX(0)'
      }
    },
    'slide-out-left': {
      '0%': {
        transform: 'translateX(0)'
      },
      '100%': {
        transform: 'translateX(-100%)'
      }
    },
    'slide-up': {
      '0%': {
        transform: 'translateY(20px)',
        opacity: '0'
      },
      '100%': {
        transform: 'translateY(0)',
        opacity: '1'
      }
    },
    'slide-down': {
      '0%': {
        transform: 'translateY(-20px)',
        opacity: '0'
      },
      '100%': {
        transform: 'translateY(0)',
        opacity: '1'
      }
    },
    
    // Loading animations
    'ping': {
      '0%': {
        transform: 'scale(1)',
        opacity: '1'
      },
      '75%, 100%': {
        transform: 'scale(2)',
        opacity: '0'
      }
    },
    'pulse': {
      '0%, 100%': {
        opacity: '1'
      },
      '50%': {
        opacity: '0.5'
      }
    },
    'spin': {
      '0%': {
        transform: 'rotate(0deg)'
      },
      '100%': {
        transform: 'rotate(360deg)'
      }
    },
    'bounce': {
      '0%, 100%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
      },
      '50%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
      }
    }
  },
  animation: {
    // Basic animations with standardized durations
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'fade-in': 'fade-in 0.3s ease-out forwards',
    'fade-out': 'fade-out 0.3s ease-out forwards',
    'scale-in': 'scale-in 0.2s ease-out forwards',
    'scale-out': 'scale-out 0.2s ease-out forwards',
    'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
    'slide-out-right': 'slide-out-right 0.3s ease-out forwards',
    'slide-in-left': 'slide-in-left 0.3s ease-out forwards',
    'slide-out-left': 'slide-out-left 0.3s ease-out forwards',
    'slide-up': 'slide-up 0.3s ease-out forwards',
    'slide-down': 'slide-down 0.3s ease-out forwards',
    
    // Loading animations with standardized durations
    'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'spin': 'spin 1s linear infinite',
    'bounce': 'bounce 1s infinite',
    
    // Combined animations for complex effects
    'enter': 'fade-in 0.3s ease-out forwards, scale-in 0.3s ease-out forwards',
    'exit': 'fade-out 0.2s ease-in forwards, scale-out 0.2s ease-in forwards',
    'notification-enter': 'slide-in-right 0.3s ease-out forwards',
    'notification-exit': 'slide-out-right 0.2s ease-in forwards',
  },
  transitionDuration: {
    '50': '50ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '300': '300ms',
    '500': '500ms',
    '700': '700ms',
    '1000': '1000ms',
    '5000': '5000ms',
    '8000': '8000ms',
  },
  transitionTimingFunction: {
    'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'in': 'cubic-bezier(0.4, 0, 1, 1)',
    'out': 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'bounce': 'cubic-bezier(0.8, 0, 1, 1)',
  },
  scale: {
    '95': '0.95',
    '98': '0.98',
    '100': '1',
    '103': '1.03',
    '105': '1.05',
    '110': '1.1',
  },
  brightness: {
    '90': '0.9',
    '95': '0.95',
    '100': '1',
    '105': '1.05',
    '110': '1.1',
    '125': '1.25',
  },
};
