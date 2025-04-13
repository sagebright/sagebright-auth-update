
// src/lib/api.ts

import { SageContext } from '@/types/chat';
import { getBasePrompt } from './promptBuilder';
import { handleApiError } from './handleApiError';
import { voiceprints } from './voiceprints';

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

  // Validate voice and get tone with error handling
  try {
    // Use the centralized prompt builder to get the system prompt
    const systemPrompt = getBasePrompt(context, voice);

    // Log the first part of the system prompt for debugging
    console.log("🧠 Final system prompt content:\n", systemPrompt.slice(0, 500) + "...");
    
    // Update model to gpt-4o as requested
    const model = "gpt-4o";
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ];

    // NEW: Add preflight validation and fingerprint
    if (messages.length === 0) {
      console.error("❌ CRITICAL ERROR: Messages array is empty in callOpenAI");
      throw new Error("No messages to send to OpenAI. Please check the message construction.");
    }

    if (!messages[0]?.content) {
      console.error("❌ CRITICAL ERROR: First message content is missing in callOpenAI");
      throw new Error("System prompt is missing. Please check the prompt builder.");
    }

    // Definitive preflight fingerprint - placed immediately before OpenAI call
    console.log("📤 Preflight OpenAI check:", {
      model,
      voice,
      messagesLength: messages.length,
      firstMessage: {
        role: messages[0].role,
        contentPreview: messages[0].content.substring(0, 300) + "...",
        contentLength: messages[0].content.length
      },
      userMessagePreview: question.substring(0, 100) + "..."
    });
    
    try {
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
          max_tokens: 1000, // Adding max_tokens as requested
        }),
      });

      // Log the raw response status immediately after await
      console.log("📥 OpenAI response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch((parseError) => {
          console.error("Failed to parse error response:", parseError);
          return { error: "Failed to parse error response" };
        });
        
        console.error("❌ OpenAI API error:", JSON.stringify(errorData, null, 2));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      console.log("Parsing JSON response from OpenAI");
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
  } catch (promptError) {
    // Handle errors in prompt generation
    console.error("❌ Error generating system prompt:", promptError);
    
    // Create a fallback prompt so the app doesn't hang
    const fallbackPrompt = "You are Sage, an AI assistant. Please respond helpfully to the user's question.";
    console.log("⚠️ Using fallback prompt due to error in prompt generation");
    
    // Continue with fallback prompt
    const model = "gpt-4o";
    const messages = [
      { role: "system", content: fallbackPrompt },
      { role: "user", content: question },
    ];
    
    try {
      console.log("Sending request to OpenAI API with fallback prompt");
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
          max_tokens: 1000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error with fallback: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content ?? "No response from Sage. Please try again later.";
    } catch (fallbackError) {
      console.error("❌ Even fallback prompt failed:", fallbackError);
      throw new Error("Unable to generate a response. Please try again later.");
    }
  }
}
