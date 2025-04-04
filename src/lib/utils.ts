
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add helper for protected route redirects
export function getRedirectPath(locationState: any): string {
  return locationState?.from?.pathname || '/user-dashboard'
}

/**
 * Extract voice parameter from URL search params
 * @returns The voice value from URL or 'default' if not present
 */
export function getVoiceFromUrl(): string {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);
  // Return the voice parameter or default if not present
  return searchParams.get('voice') || 'default';
}
