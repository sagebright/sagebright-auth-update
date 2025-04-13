
/**
 * Builds OpenAI API request payloads with standardized configuration
 */

/**
 * Build a standardized OpenAI API request payload
 */
export function buildOpenAIRequestPayload({
  systemPrompt,
  userPrompt,
  voice,
  model
}: {
  systemPrompt: string;
  userPrompt: string;
  voice?: string;
  model?: string;
}) {
  return {
    model: model || import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
    voice_injection: voice !== 'default' ? 'applied' : 'none'
  };
}

/**
 * Determine the OpenAI API endpoint URL based on environment configuration
 */
export function getOpenAIApiUrl(): string {
  return import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai';
}
