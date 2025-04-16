
/**
 * Core hook for managing voice parameter state
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { VoiceParamState, VoiceSourceCandidate } from './types';
import { validateVoice, selectBestVoiceSource, persistVoiceParam } from './utils';
import { 
  collectUrlVoiceSource, 
  collectIntentVoiceSource, 
  collectStorageVoiceSource,
  getDefaultVoiceSource 
} from './source-collectors';

/**
 * Hook that manages the internal voice parameter state
 * with source tracking and persistence logic
 */
export function useVoiceStateManager() {
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
  
  // Access intent management system
  const { activeIntent, captureIntent } = useRedirectIntentManager();
  
  // Process voice sources and update state
  useEffect(() => {
    // Start a console group for voice parameter logging
    console.group('🎤 Voice Parameter Detection');
    
    try {
      // Collect all possible voice parameter sources
      const sources: VoiceSourceCandidate[] = [];
      
      // 1. URL source (highest priority)
      const urlSource = collectUrlVoiceSource(location.search);
      if (urlSource) {
        sources.push(urlSource);
        
        if (!urlSource.isValid && !loggedWarningRef.current) {
          console.warn(`⚠️ URL contains invalid voice parameter: "${urlSource.value}". This will not be used.`);
          loggedWarningRef.current = true;
        }
      }
      
      // 2. Intent metadata (second highest)
      const intentSource = collectIntentVoiceSource(activeIntent);
      if (intentSource) {
        sources.push(intentSource);
        
        if (!intentSource.isValid) {
          console.warn(`⚠️ Intent contains invalid voice parameter: "${intentSource.value}". This will not be used.`);
        }
      }
      
      // 3. localStorage (fallback)
      const storageSource = collectStorageVoiceSource();
      if (storageSource) {
        sources.push(storageSource);
        
        if (!storageSource.isValid) {
          console.warn(`⚠️ Stored voice parameter is invalid: "${storageSource.value}". This will not be used.`);
        }
      }
      
      // 4. Default fallback (always valid)
      sources.push(getDefaultVoiceSource());
      
      // Debug log all voice sources
      console.log('Available voice sources:', sources);
      
      // Pick the best voice source
      const bestSource = selectBestVoiceSource(sources);
      
      // Create new voice state
      const newVoiceState: VoiceParamState = {
        currentVoice: bestSource.value,
        previousVoice: voiceState.currentVoice,
        source: bestSource.source,
        timestamp: bestSource.timestamp || Date.now(),
        isValid: bestSource.isValid,
        sourceDetails: bestSource.sourceDetails
      };
      
      // Only update if something relevant changed
      if (
        newVoiceState.currentVoice !== voiceState.currentVoice ||
        newVoiceState.source !== voiceState.source ||
        newVoiceState.isValid !== voiceState.isValid
      ) {
        console.log(`Voice transition: ${voiceState.currentVoice} → ${newVoiceState.currentVoice} (via ${newVoiceState.source})`);
        setVoiceState(newVoiceState);
        
        // Always persist valid voices to localStorage
        if (newVoiceState.isValid && newVoiceState.currentVoice !== 'default') {
          persistVoiceParam(newVoiceState.currentVoice);
        }
        
        // Update intent when voice changes on a path change
        if (
          location.pathname !== lastPathRef.current &&
          newVoiceState.isValid && 
          newVoiceState.currentVoice !== 'default' &&
          !location.search.includes('voice=')
        ) {
          // Preserve voice parameter in intent for possible redirects
          captureIntent(
            location.pathname + location.search,
            'user-initiated',
            {
              voiceParam: newVoiceState.currentVoice,
              source: 'voice_param_preservation',
              timestamp: Date.now()
            },
            50 // Medium priority - not as high as explicit redirects
          );
        }
      }
      
      // Update lastPathRef when path changes
      if (location.pathname !== lastPathRef.current) {
        lastPathRef.current = location.pathname;
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
  }, [location.search, location.pathname, activeIntent, captureIntent, voiceState]);
  
  return voiceState;
}
