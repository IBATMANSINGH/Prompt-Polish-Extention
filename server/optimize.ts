// Using fetch for OpenRouter API
import fetch from "node-fetch";

// Use OpenRouter's default model selection (which includes GPT models)
const DEFAULT_MODEL = "openai/gpt-4-turbo";

// OpenRouter API URL
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Get API key from environment variable
const apiKey = process.env.OPENROUTER_API_KEY || "";

// Headers for OpenRouter API
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${apiKey}`,
  "HTTP-Referer": "https://replit.com", // Required by OpenRouter
  "X-Title": "PromptPolish Extension" // Recommended by OpenRouter
};

/**
 * Optimize general text using OpenRouter API
 */
export async function optimizeText(text: string, style?: string): Promise<string> {
  try {
    const stylePrompt = style ? `Make it ${style}.` : "";
    
    const prompt = `
      Please optimize and rewrite the following text to make it more effective, clear, and concise. 
      The text should accomplish the user's goal more effectively. ${stylePrompt}

      Original text:
      ${text}
    `;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert writer and communication specialist who helps users optimize their messages to be more effective."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content?.trim() || "Failed to optimize text";
  } catch (error: any) {
    console.error("OpenRouter API error:", error);
    throw new Error(`Failed to optimize text: ${error.message}`);
  }
}

/**
 * Optimize website creation prompts using OpenRouter API
 */
export async function optimizeWebsitePrompt(
  text: string, 
  options?: {
    websiteType?: string;
    designStyle?: string;
    features?: string[];
  }
): Promise<string> {
  try {
    const websiteType = options?.websiteType || "business";
    const designStyle = options?.designStyle || "modern";
    const features = options?.features || ["responsive", "seo"];
    
    const featuresText = features.length > 0 
      ? `The website should include these features: ${features.join(", ")}.` 
      : "";
    
    const prompt = `
      Please rewrite and optimize the following rough website description into a comprehensive, well-structured prompt for creating a ${designStyle} ${websiteType} website.
      The optimized prompt should include specific details about functionality, visual design, user experience, and technical requirements.
      ${featuresText}

      Original description:
      ${text}
    `;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert web designer who helps users create comprehensive website specifications. Create detailed, specific prompts that include all necessary information for website development."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content?.trim() || "Failed to optimize website prompt";
  } catch (error: any) {
    console.error("OpenRouter API error:", error);
    throw new Error(`Failed to optimize website prompt: ${error.message}`);
  }
}
