
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
 * @param search The search string from useLocation().search
 * @returns The voice value from URL or 'default' if not present or invalid
 */
export function getVoiceFromUrl(search: string): string {
  // Parse the search params string
  const searchParams = new URLSearchParams(search);
  const voiceParam = searchParams.get('voice');
  
  console.log("🔍 Raw search string:", search);
  console.log("🔊 Parsed voice param:", voiceParam);
  
  // Return the voice parameter if it exists and is valid, otherwise 'default'
  if (voiceParam && voiceParam in voiceprints) {
    return voiceParam;
  }
  
  return 'default';
}
