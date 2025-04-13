
import { SageContext } from '@/types/chat';

/**
 * Calls the OpenAI API with the built context
 */
export async function callOpenAI({ 
  question, 
  context, 
  voice = 'default' 
}: { 
  question: string, 
  context: SageContext,
  voice?: string
}): Promise<string> {
  try {
    // Log which voice is being used for this request
    console.log(`🎙️ Making OpenAI request with voice: ${voice}`);
    
    // Import the prompt builder function
    const { getCompleteSystemPrompt } = await import('./promptBuilder');
    
    // Generate the complete system prompt with voiceprint
    const systemPrompt = getCompleteSystemPrompt(context, voice);
    
    // Debug log before making API call
    console.log("🧠 API call details:", {
      questionLength: question.length,
      systemPromptLength: systemPrompt.length,
      voice,
      contextComplete: !!context.org && !!context.user
    });
    
    // Get API URL from environment or fallback
    const apiUrl = import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai';
    
    // Make the API call with better error handling
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        voice_injection: voice !== 'default' ? 'applied' : 'none'
      }),
    });

    // Check if response is not ok
    if (!response.ok) {
      // Check if the response is JSON or not
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error("❌ OpenAI API error (JSON):", errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      } else {
        // Handle non-JSON responses like HTML error pages
        const errorText = await response.text();
        console.error("❌ OpenAI API error (non-JSON):", {
          status: response.status, 
          statusText: response.statusText,
          responsePreview: errorText.substring(0, 200) + '...'
        });
        throw new Error(`API error: ${response.status} ${response.statusText} - Non-JSON response received`);
      }
    }

    // Parse the successful JSON response
    const responseText = await response.text();
    try {
      const data = JSON.parse(responseText);
      return data.choices[0].message.content;
    } catch (parseError) {
      console.error("❌ Error parsing JSON response:", parseError, "Response text:", responseText.substring(0, 200) + '...');
      throw new Error("Failed to parse API response as JSON");
    }
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    throw error;
  }
}
