
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';

interface VoiceParamState {
  currentVoice: string;
  previousVoice: string | null;
  source: 'url' | 'storage' | 'default';
  timestamp: number;
  isValid: boolean;
}

/**
 * Enhanced hook that manages voice parameter state with history, source tracking and validation
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
  
  useEffect(() => {
    // Start a console group for voice parameter logging
    console.group('🎤 Voice Parameter Detection');
    
    try {
      // Get voice from URL search params - this is our canonical source of truth
      const voiceFromUrl = getVoiceFromUrl(location.search);
      const storedVoice = localStorage.getItem('lastVoiceParam');
      
      console.log(`Current path: ${location.pathname}, search: ${location.search}`);
      console.log(`Voice from URL: ${voiceFromUrl}, Stored voice: ${storedVoice}`);
      
      // Check if we've navigated to a new path
      if (location.pathname !== lastPathRef.current) {
        console.log(`Path changed from ${lastPathRef.current} to ${location.pathname}`);
        lastPathRef.current = location.pathname;
      }
      
      // Clear warning log flag when search params change
      if (loggedWarningRef.current && location.search) {
        loggedWarningRef.current = false;
      }
      
      // Determine the new voice parameter and its source
      let newVoice = 'default';
      let source: 'url' | 'storage' | 'default' = 'default';
      let isValid = true;
      
      // If voice is specified in URL, use it as the canonical source
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
      // If no voice in URL but we have one in storage, use that
      else if (storedVoice) {
        console.log(`Restoring voice from storage: ${storedVoice}`);
        newVoice = storedVoice;
        source = 'storage';
      }
      
      // Only update state if voice has changed or validity changed
      if (newVoice !== voiceState.currentVoice || isValid !== voiceState.isValid) {
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
  }, [location.search, location.pathname]);
  
  return voiceState.currentVoice;
}

/**
 * Returns detailed information about the voice parameter state
 * Useful for debugging and analytics
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
  
  useEffect(() => {
    try {
      const voiceFromUrl = getVoiceFromUrl(location.search);
      const storedVoice = localStorage.getItem('lastVoiceParam');
      
      let newVoice = 'default';
      let source: 'url' | 'storage' | 'default' = 'default';
      let isValid = true;
      
      if (location.search.includes('voice=')) {
        newVoice = voiceFromUrl;
        source = 'url';
        
        if (newVoice === 'default' && !loggedWarningRef.current) {
          loggedWarningRef.current = true;
          isValid = false;
        }
        
        localStorage.setItem('lastVoiceParam', voiceFromUrl);
      } else if (storedVoice) {
        newVoice = storedVoice;
        source = 'storage';
      }
      
      if (newVoice !== voiceState.currentVoice || isValid !== voiceState.isValid) {
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
  }, [location.search, location.pathname]);
  
  return voiceState;
}
