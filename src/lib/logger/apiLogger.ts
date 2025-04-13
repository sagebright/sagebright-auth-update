
/**
 * API Logger module for detailed request/response logging
 * Provides consistent logging format for all API interactions
 */

/**
 * Detailed logger for OpenAI API requests and responses
 * Captures complete context for debugging voice issues and context problems
 */
export function logApiActivity(
  stage: 'request' | 'response' | 'error',
  data: any,
  options?: { 
    voice?: string; 
    truncateContent?: boolean;
    error?: any;
    apiUrl?: string;
  }
) {
  const timestamp = new Date().toISOString();
  const { 
    voice = 'default', 
    truncateContent = true,
    apiUrl = 'Unknown Endpoint'
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
      console.log(`📡 OpenAI fetch URL: ${apiUrl}`);
      
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
