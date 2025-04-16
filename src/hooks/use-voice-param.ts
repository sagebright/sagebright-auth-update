import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';

interface VoiceParamState {
  currentVoice: string;
  previousVoice: string | null;
  source: 'url' | 'storage' | 'default';
  timestamp: number;
}

/**
 * Enhanced hook that manages voice parameter state with history and source tracking
 * @returns A string representing the current voice parameter
 */
export function useVoiceParam(): string {
  const location = useLocation();
  const [voiceState, setVoiceState] = useState<VoiceParamState>({
    currentVoice: 'default',
    previousVoice: null,
    source: 'default',
    timestamp: Date.now()
  });
  const lastPathRef = useRef<string>(location.pathname);
  
  useEffect(() => {
    // Start a console group for voice parameter logging
    console.group('🎤 Voice Parameter Detection');
    
    try {
      // Get voice from URL search params
      const voiceFromUrl = getVoiceFromUrl(location.search);
      const storedVoice = localStorage.getItem('lastVoiceParam');
      
      console.log(`Current path: ${location.pathname}, search: ${location.search}`);
      console.log(`Voice from URL: ${voiceFromUrl}, Stored voice: ${storedVoice}`);
      
      // Check if we've navigated to a new path
      if (location.pathname !== lastPathRef.current) {
        console.log(`Path changed from ${lastPathRef.current} to ${location.pathname}`);
        lastPathRef.current = location.pathname;
      }
      
      // Determine the new voice parameter and its source
      let newVoice = 'default';
      let source: 'url' | 'storage' | 'default' = 'default';
      
      // If voice is specified in URL, use it
      if (voiceFromUrl !== 'default') {
        console.log(`Setting voice from URL: ${voiceFromUrl}`);
        newVoice = voiceFromUrl;
        source = 'url';
        
        // Store for later use
        localStorage.setItem('lastVoiceParam', voiceFromUrl);
      } 
      // If no voice in URL but we have one in storage, use that
      else if (storedVoice) {
        console.log(`Restoring voice from storage: ${storedVoice}`);
        newVoice = storedVoice;
        source = 'storage';
      }
      
      // Only update state if voice has changed
      if (newVoice !== voiceState.currentVoice) {
        console.log(`Voice transition: ${voiceState.currentVoice} → ${newVoice} (via ${source})`);
        setVoiceState({
          currentVoice: newVoice,
          previousVoice: voiceState.currentVoice,
          source,
          timestamp: Date.now()
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
          timestamp: Date.now()
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
    timestamp: Date.now()
  });
  const lastPathRef = useRef<string>(location.pathname);
  
  useEffect(() => {
    // Similar implementation as useVoiceParam but returns the full state object
    const voiceFromUrl = getVoiceFromUrl(location.search);
    const storedVoice = localStorage.getItem('lastVoiceParam');
    
    let newVoice = 'default';
    let source: 'url' | 'storage' | 'default' = 'default';
    
    if (voiceFromUrl !== 'default') {
      newVoice = voiceFromUrl;
      source = 'url';
      localStorage.setItem('lastVoiceParam', voiceFromUrl);
    } else if (storedVoice) {
      newVoice = storedVoice;
      source = 'storage';
    }
    
    if (newVoice !== voiceState.currentVoice) {
      setVoiceState({
        currentVoice: newVoice,
        previousVoice: voiceState.currentVoice,
        source,
        timestamp: Date.now()
      });
    }
  }, [location.search, location.pathname]);
  
  return voiceState;
}
