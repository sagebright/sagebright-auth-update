
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { voiceprints } from "./voiceprints"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add helper for protected route redirects
export function getRedirectPath(locationState: any): string {
  return locationState?.from?.pathname || '/user-dashboard'
}

/**
 * Extract voice parameter from URL search params
 * @returns The voice value from URL or 'default' if not present or invalid
 */
export function getVoiceFromUrl(): string {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const voiceParam = searchParams.get('voice');
  
  // Return the voice parameter if it exists and is valid, otherwise 'default'
  if (voiceParam && voiceParam in voiceprints) {
    return voiceParam;
  }
  
  return 'default';
}
