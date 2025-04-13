
import { SageContext } from '@/types/chat';
import { handleApiError } from './handleApiError';

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

    // Debug response headers and status - helpful for troubleshooting
    console.log(`🔍 API Response Status: ${response.status} ${response.statusText}`);
    const contentType = response.headers.get('content-type');
    console.log(`🔍 API Response Content-Type: ${contentType}`);

    // Check if response is not ok
    if (!response.ok) {
      // Check if the response is JSON or not
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
        // The preview can help debug HTML error pages
        handleApiError(new Error(`Received HTML instead of JSON: likely a server or proxy issue`), {
          context: 'openai-api',
          showToast: true,
        });
        throw new Error(`API error: ${response.status} ${response.statusText} - Non-JSON response received. Check your API endpoint configuration.`);
      }
    }

    // Get raw response text for debugging
    const responseText = await response.text();
    
    // Add logging to see raw text response for debugging
    console.log(`🔍 API Response Text Preview: ${responseText.substring(0, 100)}...`);
    
    // Parse only if it looks like JSON
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        const data = JSON.parse(responseText);
        return data.choices[0].message.content;
      } catch (parseError) {
        console.error("❌ Error parsing JSON response:", parseError, "Response text:", responseText.substring(0, 300) + '...');
        throw new Error("Failed to parse API response as JSON. The response doesn't appear to be valid JSON.");
      }
    } else {
      console.error("❌ Non-JSON response received:", responseText.substring(0, 300) + '...');
      throw new Error("API returned non-JSON content. This could indicate a configuration issue with your API endpoint.");
    }
  } catch (error: any) {
    console.error("❌ Error calling OpenAI:", error);
    
    // Provide more specific error messages based on what went wrong
    if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
      throw new Error("Network error connecting to OpenAI. Please check your internet connection or if the API endpoint is accessible.");
    }
    
    if (error.message?.includes('HTML')) {
      throw new Error("Received HTML instead of JSON: This likely indicates a server-side issue or misconfiguration.");
    }
    
    throw error;
  }
}
