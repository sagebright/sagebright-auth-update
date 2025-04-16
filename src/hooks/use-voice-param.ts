
import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { voiceprints } from '@/lib/voiceprints';

export interface VoiceParamState {
  currentVoice: string;
  previousVoice: string | null;
  source: 'url' | 'storage' | 'intent' | 'default';
  timestamp: number;
  isValid: boolean;
  sourceDetails?: {
    urlParam?: string;
    intentId?: string;
    storageTimestamp?: number;
  };
}

type VoiceParamSource = 'url' | 'storage' | 'intent' | 'default';

interface VoiceSourceCandidate {
  value: string;
  source: VoiceParamSource;
  priority: number;
  isValid: boolean;
  timestamp: number;
  sourceDetails?: Record<string, any>;
}

/**
 * Enhanced hook that manages voice parameter state with better tracing and validation
 * Now fully integrated with intent system for persistence across page transitions
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
  const { activeIntent, captureIntent } = useRedirectIntentManager();

  // Validates if a voice parameter is valid (exists in voiceprints)
  const validateVoice = useCallback((voice: string): boolean => {
    if (!voice) return false;
    return voice in voiceprints || voice === 'default';
  }, []);
  
  // Choose the best voice parameter from all available sources
  const selectBestVoiceSource = useCallback((sources: VoiceSourceCandidate[]): VoiceSourceCandidate => {
    // Sort by priority (higher is better) and then by timestamp (newer is better)
    const validSources = sources.filter(s => s.isValid);
    
    if (validSources.length === 0) {
      console.log('🎤 No valid voice sources found, defaulting to "default"');
      return {
        value: 'default',
        source: 'default',
        priority: 0,
        isValid: true,
        timestamp: Date.now()
      };
    }
    
    // Sort by priority (descending) then by timestamp (descending)
    validSources.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return b.timestamp - a.timestamp; // Newer timestamp first
    });
    
    const selected = validSources[0];
    console.log(`🎤 Selected voice source: ${selected.source} (${selected.value})`);
    return selected;
  }, []);

  useEffect(() => {
    // Start a console group for voice parameter logging
    console.group('🎤 Voice Parameter Detection');
    
    try {
      // Collect all possible voice parameter sources
      const sources: VoiceSourceCandidate[] = [];

      // 1. URL source (highest priority - explicit user choice)
      const voiceFromUrl = getVoiceFromUrl(location.search);
      if (location.search.includes('voice=')) {
        const isUrlVoiceValid = validateVoice(voiceFromUrl);
        sources.push({
          value: voiceFromUrl,
          source: 'url',
          priority: 100, // Highest priority
          isValid: isUrlVoiceValid,
          timestamp: Date.now(),
          sourceDetails: { urlParam: location.search }
        });
        
        if (!isUrlVoiceValid && !loggedWarningRef.current) {
          console.warn(`⚠️ URL contains invalid voice parameter: "${voiceFromUrl}". This will not be used.`);
          loggedWarningRef.current = true;
        }
      }
      
      // 2. Intent metadata (second highest - preserved through redirects)
      const intentVoice = activeIntent?.metadata?.voiceParam;
      if (intentVoice) {
        const isIntentVoiceValid = validateVoice(intentVoice);
        sources.push({
          value: intentVoice,
          source: 'intent',
          priority: 90, // Second highest
          isValid: isIntentVoiceValid,
          timestamp: activeIntent.timestamp,
          sourceDetails: { 
            intentId: activeIntent.metadata?.intentId,
            intentDestination: activeIntent.destination 
          }
        });
        
        if (!isIntentVoiceValid) {
          console.warn(`⚠️ Intent contains invalid voice parameter: "${intentVoice}". This will not be used.`);
        }
      }
      
      // 3. localStorage (fallback - persistent but lower priority)
      const storedVoice = localStorage.getItem('lastVoiceParam');
      const storedTimestamp = localStorage.getItem('lastVoiceParamTimestamp');
      if (storedVoice) {
        const isStoredVoiceValid = validateVoice(storedVoice);
        sources.push({
          value: storedVoice, 
          source: 'storage',
          priority: 80, // Third highest
          isValid: isStoredVoiceValid,
          timestamp: storedTimestamp ? parseInt(storedTimestamp, 10) : 0,
          sourceDetails: { storageTimestamp: storedTimestamp ? parseInt(storedTimestamp, 10) : undefined }
        });
        
        if (!isStoredVoiceValid) {
          console.warn(`⚠️ Stored voice parameter is invalid: "${storedVoice}". This will not be used.`);
        }
      }
      
      // 4. Default fallback (always valid)
      sources.push({
        value: 'default',
        source: 'default',
        priority: 0, // Lowest priority
        isValid: true,
        timestamp: 0
      });
      
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
          localStorage.setItem('lastVoiceParam', newVoiceState.currentVoice);
          localStorage.setItem('lastVoiceParamTimestamp', Date.now().toString());
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
  }, [location.search, location.pathname, activeIntent, validateVoice, selectBestVoiceSource, captureIntent, voiceState]);
  
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
  
  // Get active intent for voice parameter preservation
  const { activeIntent, captureIntent } = useRedirectIntentManager();
  
  // Validates if a voice parameter is valid (exists in voiceprints)
  const validateVoice = useCallback((voice: string): boolean => {
    if (!voice) return false;
    return voice in voiceprints || voice === 'default';
  }, []);
  
  // Choose the best voice parameter from all available sources
  const selectBestVoiceSource = useCallback((sources: VoiceSourceCandidate[]): VoiceSourceCandidate => {
    // Filter for valid sources
    const validSources = sources.filter(s => s.isValid);
    
    if (validSources.length === 0) {
      return {
        value: 'default',
        source: 'default',
        priority: 0,
        isValid: true,
        timestamp: Date.now()
      };
    }
    
    // Sort by priority (descending) then by timestamp (descending)
    validSources.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return b.timestamp - a.timestamp; // Newer timestamp first
    });
    
    return validSources[0];
  }, []);
  
  useEffect(() => {
    try {
      // Collect all possible voice parameter sources
      const sources: VoiceSourceCandidate[] = [];
      
      // 1. URL source (highest priority)
      const voiceFromUrl = getVoiceFromUrl(location.search);
      if (location.search.includes('voice=')) {
        sources.push({
          value: voiceFromUrl,
          source: 'url',
          priority: 100,
          isValid: validateVoice(voiceFromUrl),
          timestamp: Date.now()
        });
      }
      
      // 2. Intent metadata (second highest)
      const intentVoice = activeIntent?.metadata?.voiceParam;
      if (intentVoice) {
        sources.push({
          value: intentVoice,
          source: 'intent',
          priority: 90,
          isValid: validateVoice(intentVoice),
          timestamp: activeIntent.timestamp
        });
      }
      
      // 3. localStorage (fallback)
      const storedVoice = localStorage.getItem('lastVoiceParam');
      const storedTimestamp = localStorage.getItem('lastVoiceParamTimestamp');
      if (storedVoice) {
        sources.push({
          value: storedVoice,
          source: 'storage',
          priority: 80,
          isValid: validateVoice(storedVoice),
          timestamp: storedTimestamp ? parseInt(storedTimestamp, 10) : 0
        });
      }
      
      // 4. Default fallback
      sources.push({
        value: 'default',
        source: 'default',
        priority: 0,
        isValid: true,
        timestamp: 0
      });
      
      // Pick the best voice source
      const bestSource = selectBestVoiceSource(sources);
      
      // Create new voice state
      const newVoiceState: VoiceParamState = {
        currentVoice: bestSource.value,
        previousVoice: voiceState.currentVoice,
        source: bestSource.source,
        timestamp: bestSource.timestamp || Date.now(),
        isValid: bestSource.isValid
      };
      
      // Only update if something changed
      if (
        newVoiceState.currentVoice !== voiceState.currentVoice ||
        newVoiceState.source !== voiceState.source ||
        newVoiceState.isValid !== voiceState.isValid
      ) {
        setVoiceState(newVoiceState);
        
        // Store for persistence if valid
        if (newVoiceState.isValid && newVoiceState.currentVoice !== 'default') {
          localStorage.setItem('lastVoiceParam', newVoiceState.currentVoice);
          localStorage.setItem('lastVoiceParamTimestamp', Date.now().toString());
        }
      }
      
      if (location.pathname !== lastPathRef.current) {
        lastPathRef.current = location.pathname;
      }
    } catch (error) {
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
  }, [location.search, location.pathname, activeIntent, validateVoice, selectBestVoiceSource, captureIntent, voiceState]);
  
  return voiceState;
}

/**
 * Hook to check if the current voice parameter was provided explicitly via URL
 * This is useful to determine if the voice param should be persisted or replaced
 */
export function useExplicitVoiceParam(): boolean {
  const location = useLocation();
  return location.search.includes('voice=');
}

