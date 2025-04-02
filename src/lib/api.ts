
// src/lib/api.ts

import { voiceprints, sageFramework } from './voiceprints'

export async function callOpenAI({
  question,
  context,
  voice = 'default'
}: {
  question: string
  context: string
  voice?: string
}): Promise<string> {
  console.log("🔑 VITE_OPENAI_KEY:", import.meta.env.VITE_OPENAI_KEY?.slice(0, 8))

  const tone = voiceprints[voice] || voiceprints['default']

  const systemPrompt = `
${sageFramework}

${tone}

Here’s what you know about the user and the organization:
${context}
`;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`, // Or your preferred env var
      },
      body: JSON.stringify({
        model: "gpt-4", // You can swap in gpt-3.5-turbo for faster/cheaper demo
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error("Sage had trouble responding.");
    }
  
    return data.choices?.[0]?.message?.content ?? "No response from Sage.";
  }
