
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';

export function useVoiceParam() {
  const location = useLocation();
  const [voiceParam, setVoiceParam] = useState<string>('default');
  const lastPathRef = useRef<string>(location.pathname);
  
  useEffect(() => {
    // Get voice from URL search params
    const voice = getVoiceFromUrl(location.search);
    
    console.log("🎙️ Voice param detected:", voice, "on path:", location.pathname);
    
    // Check if we've navigated to a new path
    if (location.pathname !== lastPathRef.current) {
      console.log(`🧭 Path changed from ${lastPathRef.current} to ${location.pathname}, checking voice params`);
      lastPathRef.current = location.pathname;
    }
    
    // If voice is specified in URL, use it and store it
    if (voice !== 'default') {
      console.log("🎙️ Setting voice param from URL:", voice);
      setVoiceParam(voice);
      localStorage.setItem('lastVoiceParam', voice);
    } 
    // If no voice in URL but we're on a new path, restore from storage
    else if (voice === 'default') {
      const storedVoice = localStorage.getItem('lastVoiceParam');
      if (storedVoice) {
        console.log("🎙️ Restoring voice param from storage:", storedVoice);
        setVoiceParam(storedVoice);
      }
    }
  }, [location.search, location.pathname]);
  
  return voiceParam;
}
