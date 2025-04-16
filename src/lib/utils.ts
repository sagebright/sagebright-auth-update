
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
 * Check if a voice parameter is valid (exists in voiceprints)
 * @param voice The voice parameter to validate
 * @returns Boolean indicating if the voice is valid
 */
export function isValidVoice(voice: string | null | undefined): boolean {
  if (!voice) return false;
  return voice in voiceprints || voice === 'default';
}

/**
 * Extract and validate voice parameter from URL search params
 * @param search The search string from useLocation().search
 * @returns The validated voice value from URL or 'default' if not present or invalid
 */
export function getVoiceFromUrl(search: string): string {
  try {
    // Parse the search params string
    const searchParams = new URLSearchParams(search);
    const voiceParam = searchParams.get('voice');
    
    console.log("🔍 Raw search string:", search);
    console.log("🔊 Parsed voice param:", voiceParam);
    
    // Return the voice parameter if it exists and is valid, otherwise 'default'
    if (voiceParam && isValidVoice(voiceParam)) {
      return voiceParam;
    }
    
    if (voiceParam && !isValidVoice(voiceParam)) {
      console.warn(`⚠️ Invalid voice parameter: "${voiceParam}". Falling back to "default".`);
    }
    
    return 'default';
  } catch (error) {
    console.error("❌ Error parsing voice parameter:", error);
    return 'default';
  }
}

