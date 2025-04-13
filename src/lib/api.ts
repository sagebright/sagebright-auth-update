
// src/lib/api.ts

import { SageContext } from '@/types/chat';
import { getBasePrompt } from './promptBuilder';

export async function callOpenAI({
  question,
  context,
  voice = 'default',
}: {
  question: string;
  context: SageContext;
  voice?: string;
}): Promise<string> {
  console.log("🎤 Using voice:", voice);
  console.log("🔑 Checking OpenAI key:", !!import.meta.env.VITE_OPENAI_KEY);
  console.log("📝 Context received:", {
    hasOrgData: !!context.org,
    hasUserData: !!context.user,
    userId: context.userId,
    orgId: context.orgId
  });

  if (!import.meta.env.VITE_OPENAI_KEY) {
    console.error("OpenAI API key is missing or invalid");
    throw new Error("OpenAI API key is missing. Please check your environment configuration.");
  }

  // Additional validation before proceeding
  if (!context.orgId) {
    console.error("Missing context.orgId in callOpenAI", context);
    throw new Error("Organization context is missing. Please contact support.");
  }

  // Use the centralized prompt builder to get the system prompt
  const systemPrompt = getBasePrompt(context, voice);

  try {
    console.log("Sending request to OpenAI API");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenAI API error:", errorData || response.statusText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    return data.choices?.[0]?.message?.content ?? "No response from Sage.";
  } catch (error) {
    console.error("Error in callOpenAI:", error);
    throw error;
  }
}
