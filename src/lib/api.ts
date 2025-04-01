// src/lib/api.ts

export async function callOpenAI({
    question,
    context,
  }: {
    question: string;
    context: string;
  }): Promise<string> {
    const systemPrompt = `
    You are Sage, the friendly onboarding assistant for Lumon Industries.

    Use the provided context to guide your answers, but feel free to use your own broader knowledge where helpful—especially for industry information, general best practices, or when the context is silent on a topic.

    Here's what you know about the user and the organization:
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
  