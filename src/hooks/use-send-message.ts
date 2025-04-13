
      // Validate voice parameter against available voices
      const isValidVoice = voice in voiceprints;
      
      console.group(`🔍 Voice Parameter Resolution (${timestamp})`);
      console.log("Initial voice param:", voice);
      console.log("Is valid voice:", isValidVoice);
      
      if (!isValidVoice && voice !== 'default') {
        console.warn(`⚠️ Invalid voice "${voice}" requested, falling back to default`);
        console.log("Available voices:", Object.keys(voiceprints));
      }
      
      // Use the validated voice or fall back to 'default'
      const finalVoice = isValidVoice ? voice : 'default';
      
      console.log("Final voice used:", finalVoice);
      console.groupEnd();
      
      if (!isValidVoice && voice !== 'default') {
        console.warn(`🚨 Mismatch detected: "${voice}" not in available voices. Using "${finalVoice}"`);
      }
