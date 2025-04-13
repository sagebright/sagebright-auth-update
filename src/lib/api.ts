
import { supabase } from './supabaseClient';
import { SageContext } from '@/types/chat';
import { validateOpenAIRequest } from './validation/contextSchema';
import { handleApiError } from './handleApiError';

/**
 * Detailed logger for OpenAI API requests and responses
 * Captures complete context for debugging voice issues and context problems
 */
function logApiActivity(
  stage: 'request' | 'response' | 'error',
  data: any,
  options?: { 
    voice?: string; 
    truncateContent?: boolean;
    error?: any;
    apiUrl?: string;  // New optional parameter for API URL
  }
) {
  const timestamp = new Date().toISOString();
  const { 
    voice = 'default', 
    truncateContent = true,
    apiUrl = 'Unknown Endpoint'  // Default fallback
  } = options || {};
  
  const contentPreview = (content: string) => {
    if (!content) return 'null or empty';
    return truncateContent ? `${content.substring(0, 100)}... (${content.length} chars)` : content;
  };

  switch (stage) {
    case 'request':
      console.groupCollapsed(`📤 OpenAI API Request [${timestamp}] voice=${voice}`);
      
      // Add API URL logging
      console.log('🌐 API Endpoint:', apiUrl);
      
      // Log important request metadata
      console.log('🔑 Request Key Data:', {
        timestamp,
        voice,
        model: data.model,
        promptTokenEstimate: Math.round(JSON.stringify(data.messages).length / 4),
        systemPromptLength: data.messages[0]?.content?.length || 0,
        userPromptLength: data.messages[1]?.content?.length || 0
      });
      
      // Log complete messages for debugging
      console.log('📝 Full Messages:');
      data.messages.forEach((msg: any, i: number) => {
        console.log(`Message ${i} (${msg.role}):`);
        console.log(contentPreview(msg.content));
      });
      
      // Full payload for debugging
      console.log('📦 Complete Payload:', data);
      console.groupEnd();
      break;
      
    case 'response':
      console.groupCollapsed(`📥 OpenAI API Response [${timestamp}] voice=${voice}`);
      
      // Add API URL logging
      console.log('🌐 API Endpoint:', apiUrl);
      
      // Log response metadata
      console.log('✅ Response Key Data:', {
        timestamp,
        voice,
        status: 'success',
        responseTime: data.responseTime,
        choiceIndex: data.choices?.[0]?.index,
        finishReason: data.choices?.[0]?.finish_reason
      });
      
      // Log the actual content returned
      if (data.choices && data.choices.length > 0) {
        console.log('📄 Content:', contentPreview(data.choices[0].message.content));
      }
      
      // Full response for debugging
      console.log('📦 Complete Response:', data);
      console.groupEnd();
      break;
      
    case 'error':
      console.group(`❌ OpenAI API Error [${timestamp}] voice=${voice}`);
      
      // Add API URL logging
      console.log('🌐 API Endpoint:', apiUrl);
      
      // Log error details
      console.error('🚨 Error Details:', {
        timestamp,
        voice,
        message: options?.error?.message || 'Unknown error',
        status: options?.error?.status || 'Unknown status',
        type: options?.error?.type || 'Unknown type'
      });
      
      // Log the request that caused the error
      console.error('📤 Failed Request:', data);
      
      // Full error for debugging
      console.error('📦 Complete Error:', options?.error);
      console.groupEnd();
      break;
  }
}

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
    
    // Determine the full API URL, preserving existing logic
    const apiUrl = import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai';
    
    // Build the complete request payload
    const requestPayload = {
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
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
    };
    
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
