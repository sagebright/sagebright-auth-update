
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
  
  // Store the raw search string and previous search for comparison
  const searchRef = useRef<string>(location.search);
  const prevSearchRef = useRef<string>('');
  
  useEffect(() => {
    // Only process if search string has changed
    if (location.search !== prevSearchRef.current) {
      prevSearchRef.current = location.search;
      searchRef.current = location.search;
      
      console.log("🎤 useVoiceParam: Raw search string:", location.search);
      
      // Multiple fallback mechanisms for voice param extraction
      const voiceParams = [
        () => new URLSearchParams(location.search).get('voice'),
        () => new URLSearchParams(window.location.search).get('voice'),
        () => new URL(window.location.href).searchParams.get('voice')
      ];
      
      const voiceParam = voiceParams.reduce((found, extractor) => {
        if (found) return found;
        return extractor();
      }, null as string | null);
      
      console.log("🎤 useVoiceParam: Parsed voice param:", voiceParam);
      
      // Validate the voice parameter with more detailed logging
      if (voiceParam && voiceprints[voiceParam]) {
        console.log("🎤 useVoiceParam: Valid voice selected:", voiceParam);
        setVoice(voiceParam);
      } else if (voiceParam) {
        console.warn("⚠️ useVoiceParam: Invalid voice requested, using default");
        setVoice('default');
      }
    }
  }, [location.search]);
  
  return voice;
}
