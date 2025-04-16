
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';
import { useRedirectIntentManager } from '@/lib/redirect-intent';

interface VoiceParamState {
  currentVoice: string;
  previousVoice: string | null;
  source: 'url' | 'storage' | 'intent' | 'default';
  timestamp: number;
  isValid: boolean;
}

/**
 * Enhanced hook that manages voice parameter state with history, source tracking and validation
 * Now with intent system integration
 * @returns A string representing the current voice parameter
 */
export function useVoiceParam(): string {
  const location = useLocation();
  const [voiceState, setVoiceState] = useState<VoiceParamState>({
    currentVoice: 'default',
    previousVoice: null,
    source: 'default',
    timestamp: Date.now(),
    isValid: true
  });
  const lastPathRef = useRef<string>(location.pathname);
  const loggedWarningRef = useRef<boolean>(false);
  
  // Get active intent for voice parameter preservation
  const { activeIntent } = useRedirectIntentManager();
  
  useEffect(() => {
    // Start a console group for voice parameter logging
    console.group('🎤 Voice Parameter Detection');
    
    try {
      // Get voice from URL search params - this is our canonical source of truth
      const voiceFromUrl = getVoiceFromUrl(location.search);
      const storedVoice = localStorage.getItem('lastVoiceParam');
      
      // Check for voice in active intent (new high-priority source)
      const intentVoice = activeIntent?.metadata?.voiceParam;
      
      console.log(`Current path: ${location.pathname}, search: ${location.search}`);
      console.log(`Voice sources: URL: ${voiceFromUrl}, Storage: ${storedVoice}, Intent: ${intentVoice}`);
      
      // Check if we've navigated to a new path
      if (location.pathname !== lastPathRef.current) {
        console.log(`Path changed from ${lastPathRef.current} to ${location.pathname}`);
        lastPathRef.current = location.pathname;
      }
      
      // Clear warning log flag when search params change
      if (loggedWarningRef.current && location.search) {
        loggedWarningRef.current = false;
      }
      
      // Determine the new voice parameter and its source - now with intent priority
      let newVoice = 'default';
      let source: 'url' | 'storage' | 'intent' | 'default' = 'default';
      let isValid = true;
      
      // Priority 1: Check URL (highest priority)
      if (location.search.includes('voice=')) {
        newVoice = voiceFromUrl;
        source = 'url';
        
        // Only log warning once per parameter lifecycle
        if (newVoice === 'default' && !loggedWarningRef.current) {
          console.warn('⚠️ URL contains voice parameter but it\'s invalid. Using default.');
          loggedWarningRef.current = true;
          isValid = false;
        }
        
        // Store for later use
        localStorage.setItem('lastVoiceParam', voiceFromUrl);
      } 
      // Priority 2: Check intent metadata (new high priority source)
      else if (intentVoice) {
        console.log(`Using voice from intent metadata: ${intentVoice}`);
        newVoice = intentVoice;
        source = 'intent';
        
        // Store for persistence
        localStorage.setItem('lastVoiceParam', intentVoice);
      }
      // Priority 3: Check localStorage
      else if (storedVoice) {
        console.log(`Restoring voice from storage: ${storedVoice}`);
        newVoice = storedVoice;
        source = 'storage';
      }
      
      // Only update state if voice has changed or validity changed
      if (newVoice !== voiceState.currentVoice || isValid !== voiceState.isValid || source !== voiceState.source) {
        console.log(`Voice transition: ${voiceState.currentVoice} → ${newVoice} (via ${source})`);
        setVoiceState({
          currentVoice: newVoice,
          previousVoice: voiceState.currentVoice,
          source,
          timestamp: Date.now(),
          isValid
        });
      }
    } catch (error) {
      console.error('Error in voice parameter processing:', error);
      // Fallback to default on error
      if (voiceState.currentVoice !== 'default') {
        setVoiceState({
          currentVoice: 'default',
          previousVoice: voiceState.currentVoice,
          source: 'default',
          timestamp: Date.now(),
          isValid: false
        });
      }
    }
    
    console.groupEnd();
  }, [location.search, location.pathname, activeIntent]);
  
  return voiceState.currentVoice;
}

/**
 * Returns detailed information about the voice parameter state
 * Useful for debugging and analytics
 * Now with intent system integration
 */
export function useVoiceParamState(): VoiceParamState {
  const location = useLocation();
  const [voiceState, setVoiceState] = useState<VoiceParamState>({
    currentVoice: 'default',
    previousVoice: null,
    source: 'default',
    timestamp: Date.now(),
    isValid: true
  });
  const lastPathRef = useRef<string>(location.pathname);
  const loggedWarningRef = useRef<boolean>(false);
  
  // Get active intent for voice parameter preservation
  const { activeIntent } = useRedirectIntentManager();
  
  useEffect(() => {
    try {
      const voiceFromUrl = getVoiceFromUrl(location.search);
      const storedVoice = localStorage.getItem('lastVoiceParam');
      const intentVoice = activeIntent?.metadata?.voiceParam;
      
      let newVoice = 'default';
      let source: 'url' | 'storage' | 'intent' | 'default' = 'default';
      let isValid = true;
      
      // Priority 1: URL (highest)
      if (location.search.includes('voice=')) {
        newVoice = voiceFromUrl;
        source = 'url';
        
        if (newVoice === 'default' && !loggedWarningRef.current) {
          loggedWarningRef.current = true;
          isValid = false;
        }
        
        localStorage.setItem('lastVoiceParam', voiceFromUrl);
      } 
      // Priority 2: Intent metadata
      else if (intentVoice) {
        newVoice = intentVoice;
        source = 'intent';
        localStorage.setItem('lastVoiceParam', intentVoice);
      }
      // Priority 3: Storage
      else if (storedVoice) {
        newVoice = storedVoice;
        source = 'storage';
      }
      
      if (newVoice !== voiceState.currentVoice || isValid !== voiceState.isValid || source !== voiceState.source) {
        setVoiceState({
          currentVoice: newVoice,
          previousVoice: voiceState.currentVoice,
          source,
          timestamp: Date.now(),
          isValid
        });
      }
    } catch (error) {
      setVoiceState({
        currentVoice: 'default',
        previousVoice: voiceState.currentVoice,
        source: 'default',
        timestamp: Date.now(),
        isValid: false
      });
    }
  }, [location.search, location.pathname, activeIntent]);
  
  return voiceState;
}
