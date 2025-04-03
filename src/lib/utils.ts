
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVoiceFromUrl(): string {
  if (typeof window === 'undefined') return 'default'
  const params = new URLSearchParams(window.location.search)
  return params.get('voice') || 'default'
}

// Add helper for protected route redirects
export function getRedirectPath(locationState: any): string {
  return locationState?.from?.pathname || '/user-dashboard'
}
