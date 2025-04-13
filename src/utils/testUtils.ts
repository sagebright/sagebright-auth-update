
import { SageContext } from '@/types/chat';

/**
 * Mock API response for testing
 * Creates a mock Response object that conforms to the Response interface
 */
export function mockApiResponse(success: boolean, content?: string): Response {
  const baseHeaders = new Headers({
    'Content-Type': 'application/json'
  });
  
  if (success) {
    const responseBody = JSON.stringify({
      choices: [
        {
          message: {
            content: content || "This is a test response from the mock API."
          }
        }
      ]
    });
    
    return new Response(responseBody, {
      status: 200,
      statusText: 'OK',
      headers: baseHeaders
    });
  } else {
    // Return a failed response
    const errorHtml = '<!DOCTYPE html><html><body>Error page</body></html>';
    
    return new Response(errorHtml, {
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    });
  }
}

/**
 * Test voice parameter handling
 */
export async function testVoiceInjection(voice: string) {
  console.log(`🧪 Testing voice parameter: "${voice}"`);
  
  // Import necessary functions
  const { getCompleteSystemPrompt } = await import('@/lib/promptBuilder');
  
  // Create a minimal context
  const testContext: SageContext = {
    messages: [],
    org: {
      name: 'Test Organization',
      mission: 'Testing voice parameters',
    },
    user: {
      role: 'Test User',
      department: 'QA',
    },
    userId: 'test-user-id',
    orgId: 'test-org-id',
  };
  
  // Get the system prompt with the test voice
  const systemPrompt = getCompleteSystemPrompt(testContext, voice);
  
  // Check if the voiceprint is included in the prompt
  const { voiceprints } = await import('@/lib/voiceprints');
  const expectedVoiceprint = voiceprints[voice] || voiceprints['default'];
  const voiceprintIncluded = systemPrompt.includes(expectedVoiceprint.substring(0, 20));
  
  console.log(`🧪 Test results for voice "${voice}":`);
  console.log(`- Voice parameter valid: ${voice in voiceprints}`);
  console.log(`- Voiceprint included in prompt: ${voiceprintIncluded}`);
  console.log(`- Prompt length: ${systemPrompt.length} characters`);
  
  return {
    voice,
    isValid: voice in voiceprints,
    promptIncludesVoiceprint: voiceprintIncluded,
    promptLength: systemPrompt.length,
    success: voiceprintIncluded && (voice in voiceprints || voice === 'default'),
  };
}

/**
 * Test API error handling
 */
export async function testApiErrorHandling() {
  console.log('🧪 Testing API error handling');
  
  // Save the original fetch function
  const originalFetch = window.fetch;
  
  try {
    // Override fetch to return an error
    window.fetch = () => Promise.resolve(mockApiResponse(false));
    
    // Import the API function
    const { callOpenAI } = await import('@/lib/api');
    
    // Try to call the API with a minimal context
    const testContext: SageContext = {
      messages: [],
      org: { name: 'Test Org' },
      user: { role: 'Tester' },
      userId: 'test-user',
      orgId: 'test-org',
    };
    
    // This should throw an error, which we'll catch
    try {
      await callOpenAI({
        question: 'Test question',
        context: testContext,
        voice: 'default'
      });
      console.log('❌ Test failed: API call should have thrown an error');
      return { success: false, message: 'API error handling failed to throw an error' };
    } catch (error) {
      console.log('✅ Test passed: API error correctly thrown and caught');
      return { success: true, message: 'API error handling works correctly' };
    }
  } finally {
    // Restore the original fetch function
    window.fetch = originalFetch;
  }
}
