
/**
 * Sagebright Color System
 * 
 * This file defines all the color tokens used throughout the application.
 * We use semantic naming (primary, accent1, etc.) rather than literal color names
 * for better maintainability and theme adaptability.
 */

export const colors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  
  // Semantic brand colors
  primary: 'hsl(var(--primary))',
  'primary-foreground': 'hsl(var(--primary-foreground))',
  
  secondary: 'hsl(var(--secondary))',
  'secondary-foreground': 'hsl(var(--secondary-foreground))',
  
  accent1: 'hsl(var(--accent1))',
  'accent1-foreground': 'hsl(var(--accent1-foreground))',
  
  accent2: 'hsl(var(--accent2))',
  'accent2-foreground': 'hsl(var(--accent2-foreground))',
  
  charcoal: 'hsl(var(--charcoal))',
  'charcoal-foreground': 'hsl(var(--charcoal-foreground))',
  
  // UI semantics 
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  
  // Legacy color mapping - for backward compatibility
  sagebright: {
    green: 'hsl(var(--primary))',     // Maps to primary
    gold: 'hsl(var(--accent2))',      // Maps to accent2
    accent: 'hsl(var(--secondary))',  // Maps to secondary
    navy: 'hsl(var(--charcoal))',     // Maps to charcoal
    coral: 'hsl(var(--accent1))',     // Maps to accent1
  },
  bittersweet: 'hsl(var(--accent1))',   // Maps to accent1 
  sunglow: 'hsl(var(--accent2))',       // Maps to accent2
  
  // Sidebar specific colors
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  }
};
