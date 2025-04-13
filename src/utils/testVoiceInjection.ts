
import { SageContext } from '@/types/chat';
import { getCompleteSystemPrompt } from '@/lib/promptBuilder';
import { voiceprints } from '@/lib/voiceprints';

/**
 * Test utility for validating voice parameter injection into system prompts
 * This helps debug issues with voice integration without making API calls
 */
export function testVoiceInjection(voice: string = 'default') {
  console.log("🧪 TESTING VOICE INJECTION FOR:", voice);
  
  // Create a minimal test context
  const testContext: SageContext = {
    userId: 'test-user-id',
    orgId: 'test-org-id',
    org: {
      name: 'Test Organization',
      mission: 'Testing voice injection',
      values: ['Quality', 'Reliability'],
    },
    user: {
      role: 'Tester',
      department: 'QA',
      goals: ['Validate voice injection']
    }
  };
  
  try {
    // 1. Verify voice exists in voiceprints
    const voiceExists = voice in voiceprints;
    console.log(`🔍 Voice "${voice}" exists in voiceprints:`, voiceExists);
    if (!voiceExists) {
      console.error(`❌ Voice "${voice}" not found in voiceprints!`);
      console.log("📋 Available voices:", Object.keys(voiceprints).join(', '));
      return false;
    }
    
    // 2. Get voiceprint content for this voice
    const voiceprintContent = voiceprints[voice];
    console.log(`📝 Voiceprint content for "${voice}" (first 50 chars):`, 
      voiceprintContent.substring(0, 50) + '...');
    
    // 3. Generate system prompt with this voice
    const systemPrompt = getCompleteSystemPrompt(testContext, voice);
    
    // 4. Verify prompt contains the voiceprint content
    const containsVoiceprint = systemPrompt.includes(voiceprintContent.trim());
    console.log(`✅ System prompt contains voiceprint:`, containsVoiceprint);
    
    // 5. Check prompt structure
    const hasVoiceTag = systemPrompt.includes(`\n\n---\nVOICE: ${voice}\n---\n`);
    console.log(`✅ System prompt includes voice tag:`, hasVoiceTag);
    
    // 6. Log prompt stats
    console.log(`📊 System prompt stats:`, {
      totalLength: systemPrompt.length,
      voiceprintLength: voiceprintContent.length,
      promptSuccessful: containsVoiceprint && hasVoiceTag
    });
    
    // 7. Return overall success
    return containsVoiceprint && hasVoiceTag;
  } catch (error) {
    console.error('❌ Error while testing voice injection:', error);
    return false;
  }
}

/**
 * Run tests for all available voices to ensure they all work
 */
export function testAllVoices() {
  console.log("🧪 TESTING ALL VOICE INJECTIONS");
  
  const voices = Object.keys(voiceprints);
  console.log(`📋 Found ${voices.length} voices to test:`, voices.join(', '));
  
  const results = voices.map(voice => {
    const success = testVoiceInjection(voice);
    return { voice, success };
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`📊 Test results: ${successCount}/${voices.length} voices passed`);
  
  if (successCount < voices.length) {
    console.error('❌ The following voices failed:',
      results.filter(r => !r.success).map(r => r.voice).join(', '));
  } else {
    console.log('✅ All voices passed testing!');
  }
  
  return results;
}
