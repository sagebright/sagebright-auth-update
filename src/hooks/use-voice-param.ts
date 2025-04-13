
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { voiceprints } from '@/lib/voiceprints';

/**
 * Custom hook to reliably extract and validate the voice parameter from URL
 * Handles timing issues with search params during navigation and page loads
 * @returns The validated voice parameter or 'default' if not valid
 */
export function useVoiceParam(): string {
  const location = useLocation();
  const [voice, setVoice] = useState<string>('default');
  
  // Store the raw search string for debugging
  const searchRef = useRef<string>(location.search);
  
  // Update the search ref and parse voice param whenever location changes
  useEffect(() => {
    // Only process if we have a search string
    if (location.search) {
      searchRef.current = location.search;
      console.log("🎤 useVoiceParam: Raw search string:", location.search);
      
      // Parse the search params
      const searchParams = new URLSearchParams(location.search);
      const voiceParam = searchParams.get('voice');
      
      console.log("🎤 useVoiceParam: Parsed voice param:", voiceParam);
      
      // Validate the voice parameter
      if (voiceParam && voiceprints[voiceParam]) {
        console.log("🎤 useVoiceParam: Valid voice selected:", voiceParam);
        setVoice(voiceParam);
      } else if (voiceParam) {
        console.log("⚠️ useVoiceParam: Invalid voice requested, using default");
        setVoice('default');
      }
    } else if (window.location.search) {
      // Fallback to window.location.search if React Router's location.search is empty
      // This can happen during initial loads and some redirects
      console.log("🎤 useVoiceParam: Falling back to window.location.search:", window.location.search);
      const searchParams = new URLSearchParams(window.location.search);
      const voiceParam = searchParams.get('voice');
      
      if (voiceParam && voiceprints[voiceParam]) {
        console.log("🎤 useVoiceParam: Valid voice from fallback:", voiceParam);
        setVoice(voiceParam);
      }
    }
  }, [location.search]);
  
  return voice;
}
