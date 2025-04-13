
// src/lib/api.ts

import { SageContext } from '@/types/chat';
import { getBasePrompt } from './promptBuilder';
import { handleApiError } from './handleApiError';

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
  
  const model = "gpt-4";
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
  ];

  try {
    // Log the full request details
    console.log("📤 Sending to OpenAI:", { 
      model, 
      voice,
      messages: [
        { role: "system", content: systemPrompt.substring(0, 100) + "... [truncated]" },
        { role: "user", content: question }
      ]
    });
    
    console.log("Sending request to OpenAI API");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    // Log the raw response status
    console.log("📥 OpenAI response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch((parseError) => {
        console.error("Failed to parse error response:", parseError);
        return { error: "Failed to parse error response" };
      });
      
      console.error("❌ OpenAI API error:", JSON.stringify(errorData, null, 2));
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ OpenAI response received:", {
      model: data.model, 
      usage: data.usage,
      responseFirstTokens: data.choices?.[0]?.message?.content?.substring(0, 50) + "... [truncated]"
    });

    if (!data.choices || data.choices.length === 0) {
      console.error("❌ OpenAI returned no choices:", JSON.stringify(data, null, 2));
      throw new Error("OpenAI API returned an empty response. Please try again.");
    }

    return data.choices[0].message.content ?? "No response from Sage.";
  } catch (error) {
    // Comprehensive error logging
    console.error("❌ Error in callOpenAI:", JSON.stringify(error, null, 2));
    console.error("Error object:", error);
    
    // Rethrow the error to be handled by the caller
    throw error;
  }
}
