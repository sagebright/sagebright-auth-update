
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
    
    console.log("🔌 Making API request to:", apiUrl);
    
    // Make the API call
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

    // Check if response is OK and log detailed info either way
    if (!response.ok) {
      console.error("❌ OpenAI API error response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()])
      });
      
      // Try to get the response text to see what's being returned
      const responseText = await response.text();
      console.error("❌ OpenAI API error response body:", responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
      
      // If it looks like HTML, log a specific warning
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.error("❌ Received HTML instead of JSON. This usually indicates a network issue, incorrect URL, or server error.");
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Try parsing the JSON more defensively
    let data;
    try {
      const responseText = await response.text();
      console.log("✅ Received response from OpenAI, length:", responseText.length);
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from API");
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("❌ Unexpected response structure:", data);
      throw new Error("Unexpected response structure from API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    throw error;
  }
}
