
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getVoiceFromUrl } from '@/lib/utils';

export function useVoiceParam() {
  const location = useLocation();
  const [voiceParam, setVoiceParam] = useState<string>('default');
  
  useEffect(() => {
    // Get voice from URL search params
    const voice = getVoiceFromUrl(location.search);
    
    console.log("🎙️ Voice param detected:", voice);
    setVoiceParam(voice);
    
    // Check if we need to restore voice param from localStorage
    if (voice === 'default') {
      const storedVoice = localStorage.getItem('lastVoiceParam');
      if (storedVoice) {
        console.log("🎙️ Restoring voice param from storage:", storedVoice);
        setVoiceParam(storedVoice);
      }
    } else {
      // Store current voice param for future use
      localStorage.setItem('lastVoiceParam', voice);
    }
  }, [location.search]);
  
  return voiceParam;
}
