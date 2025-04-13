
import { SageContext } from '@/types/chat';

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
  }
) {
  const timestamp = new Date().toISOString();
  const { voice = 'default', truncateContent = true } = options || {};
  
  // Only truncate large content in normal logs, not error logs
  const contentPreview = (content: string) => {
    if (!content) return 'null or empty';
    return truncateContent ? `${content.substring(0, 100)}... (${content.length} chars)` : content;
  };

  switch (stage) {
    case 'request':
      console.groupCollapsed(`📤 OpenAI API Request [${timestamp}] voice=${voice}`);
      
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
    
    // Import the prompt builder function
    const { getCompleteSystemPrompt } = await import('./promptBuilder');
    
    // Generate the complete system prompt with voiceprint
    const systemPrompt = getCompleteSystemPrompt(context, voice);
    
    // Get API URL from environment or fallback
    const apiUrl = import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai';
    
    // Build the complete request payload
    const requestPayload = {
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
    };
    
    // Log detailed request information before making API call
    logApiActivity('request', requestPayload, { voice });
    
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
      console.error("❌ OpenAI API error:", errorData);
      
      // Log detailed error information
      logApiActivity('error', requestPayload, { 
        voice, 
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
    logApiActivity('response', enrichedData, { voice });
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    throw error;
  }
}
