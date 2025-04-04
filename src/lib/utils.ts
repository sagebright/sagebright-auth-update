
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add helper for protected route redirects
export function getRedirectPath(locationState: any): string {
  return locationState?.from?.pathname || '/user-dashboard'
}
