
import { SageContext } from '@/types/chat';
import { validateOpenAIRequest } from './validation/contextSchema';
import { handleApiError } from './handleApiError';
import { logApiActivity } from './logger/apiLogger';
import { buildOpenAIRequestPayload, getOpenAIApiUrl } from './openai/requestBuilder';

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
    
    // Validate the request parameters before proceeding
    try {
      validateOpenAIRequest({ question, context, voice });
    } catch (validationError) {
      // Handle validation errors with our centralized error handler
      handleApiError(validationError, {
        context: "context-validation",
        fallbackMessage: "Invalid context for OpenAI request. Check console for details.",
        showToast: true
      });
      
      throw new Error("Context validation failed");
    }
    
    // Import the prompt builder function
    const { getCompleteSystemPrompt } = await import('./promptBuilder');
    
    // Generate the complete system prompt with voiceprint
    const systemPrompt = getCompleteSystemPrompt(context, voice);
    
    // Determine the full API URL
    const apiUrl = getOpenAIApiUrl();
    
    // Build the complete request payload
    const requestPayload = buildOpenAIRequestPayload({
      systemPrompt,
      userPrompt: question,
      voice,
      model: import.meta.env.VITE_OPENAI_MODEL
    });
    
    // Log detailed request information before making API call
    logApiActivity('request', requestPayload, { voice, apiUrl });
    
    // Record request start time for performance monitoring
    const requestStartTime = performance.now();
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    // Calculate response time
    const responseTime = Math.round(performance.now() - requestStartTime);

    if (!response.ok) {
      const errorData = await response.json();
      
      // Log detailed error information
      logApiActivity('error', requestPayload, { 
        voice, 
        apiUrl,
        error: {
          ...errorData,
          status: response.status,
          statusText: response.statusText
        }
      });
      
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Add response time to the data object for logging
    const enrichedData = {
      ...data,
      responseTime
    };
    
    // Log detailed response information
    logApiActivity('response', enrichedData, { voice, apiUrl });
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    throw error;
  }
}
