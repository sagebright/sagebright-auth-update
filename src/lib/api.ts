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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    throw error;
  }
}
