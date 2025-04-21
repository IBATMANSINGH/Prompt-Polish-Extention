/**
 * PromptPolish Optimization Engine
 * 
 * This module provides text optimization services using the OpenRouter API
 * to access advanced AI models like Claude 3.7 Sonnet. It contains two main functions:
 * 
 * 1. optimizeText - For general text optimization with style options
 * 2. optimizeWebsitePrompt - Specifically for enhancing website creation prompts
 * 
 * Each function uses carefully engineered system prompts to guide the AI
 * in producing high-quality optimizations tailored to the user's needs.
 */

// Using fetch for OpenRouter API
import fetch from "node-fetch";

// Use Claude 3.7 Sonnet via OpenRouter (newest model as of April 2025)
const DEFAULT_MODEL = "anthropic/claude-3-7-sonnet-20250219";

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
 * Optimize general text using OpenRouter API with advanced prompt engineering
 * 
 * This function takes any text input and enhances it using AI-powered optimization.
 * It can apply different writing styles based on the provided style parameter.
 * 
 * @param {string} text - The original text to optimize
 * @param {string} [style] - Optional style to apply (professional, concise, friendly, persuasive, technical)
 * @returns {Promise<string>} A promise that resolves to the optimized text
 * @throws {Error} If the API request fails or returns an error
 */
export async function optimizeText(text: string, style?: string): Promise<string> {
  try {
    let styleInstructions = "";
    
    if (style) {
      switch (style.toLowerCase()) {
        case "professional":
          styleInstructions = "Use formal language, industry-specific terminology, and a structured format. Eliminate casual expressions and maintain an authoritative tone.";
          break;
        case "concise":
          styleInstructions = "Reduce word count by 40% while preserving all key information. Use tight phrasing, active voice, and eliminate redundancies.";
          break;
        case "friendly":
          styleInstructions = "Use conversational language, personal pronouns, and a warm tone. Add natural transitions and approachable phrasing.";
          break;
        case "persuasive":
          styleInstructions = "Incorporate persuasive techniques: problem-solution framing, social proof, scarcity principles, and compelling calls to action.";
          break;
        case "technical":
          styleInstructions = "Prioritize precision, use domain-specific terminology correctly, maintain logical structure, and include specific technical details where appropriate.";
          break;
        default:
          styleInstructions = `Make it ${style} by adjusting the tone, vocabulary, and structure appropriately.`;
      }
    }
    
    const systemPrompt = `You are an expert communication strategist with extensive experience in content optimization. 
Your task is to improve text for maximum impact, clarity, and effectiveness.

OPTIMIZATION GUIDELINES:
1. Identify the core purpose of the text and ensure it's communicated clearly and convincingly
2. Reorganize content to present the most important information first when appropriate
3. Replace vague statements with specific, concrete details
4. Eliminate unnecessary words, redundancies, and filler phrases
5. Use active voice, strong verbs, and precise language
6. Ensure logical flow with appropriate transitions
7. Adjust tone and complexity to match the intended audience
8. Maintain the original meaning while improving expression
${styleInstructions ? `9. STYLE REQUIREMENTS: ${styleInstructions}` : ''}

Return ONLY the improved text without explanations, notes, or meta-commentary. Do not include phrases like "Here's the optimized version" or "Improved text:".`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
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
 * Optimize website creation prompts using OpenRouter API with advanced prompt engineering
 * 
 * This specialized function enhances prompts intended for website creation by adding
 * structured details, technical specifications, and best practices based on the provided
 * website type, design style, and feature requirements.
 * 
 * @param {string} text - The original website description to enhance
 * @param {Object} [options] - Optional configuration for the website optimization
 * @param {string} [options.websiteType] - Type of website (business, portfolio, ecommerce, blog, personal)
 * @param {string} [options.designStyle] - Design style (modern, minimalist, colorful, corporate, creative)
 * @param {string[]} [options.features] - Array of features to include (responsive, seo, contact-form, etc.)
 * @returns {Promise<string>} A promise that resolves to the optimized website creation prompt
 * @throws {Error} If the API request fails or returns an error
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
    
    // Generate detailed feature expectations based on selected features
    const featureDetails: Record<string, string> = {
      "responsive": "Responsive design that works seamlessly across desktop, tablet, and mobile devices with appropriate breakpoints and mobile-specific UI considerations",
      "seo": "SEO best practices including semantic HTML structure, meta tags, schema markup, sitemap, robots.txt, and optimization for search engine visibility",
      "contact-form": "Contact form with proper validation, spam protection, error handling, success states, and email notification functionality",
      "social-media": "Social media integration including share buttons, feed widgets, and social account linking with appropriate API implementations",
      "animations": "Tasteful animations for UI elements, page transitions, scrolling effects, and interactive components that enhance user experience without compromising performance",
      "analytics": "Web analytics setup with event tracking, conversion funnels, user journey mapping, and dashboard for monitoring key performance metrics"
    };
    
    // Build detailed feature requirements
    const detailedFeatures = features.map(feature => featureDetails[feature] || feature).join("\n- ");
    const featuresSection = features.length > 0 
      ? `\n\nREQUIRED FEATURES:\n- ${detailedFeatures}` 
      : "";
      
    // Website type-specific guidance
    const websiteTypeDetails: Record<string, string> = {
      "business": "Include sections for company overview, services/products, team, testimonials, and clear calls to action. Focus on conveying professionalism and building trust.",
      "portfolio": "Showcase work samples prominently with filtering options, detailed project information, and prominent contact information for potential clients.",
      "ecommerce": "Include product catalog, search functionality, shopping cart, checkout process, account management, and payment gateway integration.",
      "blog": "Feature content organization, categories, tags, search, commenting system, subscription options, and social sharing capabilities.",
      "personal": "Create a personal brand presence with about section, skills/expertise, timeline or story elements, and personalized contact options."
    };
    
    // Design style-specific guidance
    const designStyleDetails: Record<string, string> = {
      "modern": "Clean layout with ample whitespace, sans-serif typography, subtle shadows, minimal color palette, flat design elements, and grid-based organization.",
      "minimalist": "Extremely simplified UI, significant negative space, monochromatic or limited color scheme, typography-focused design, and elimination of all non-essential elements.",
      "colorful": "Vibrant color palette, playful typography, dynamic layout with visual hierarchy enhanced through color contrast, and engaging visual elements.",
      "corporate": "Professional appearance with structured layout, subdued color scheme based on brand colors, clearly defined sections, and emphasis on clarity and credibility.",
      "creative": "Unique layout patterns, experimental typography, distinctive visual elements, innovative navigation concepts, and memorable interactive components."
    };
    
    const systemPrompt = `You are a senior website architect and UX designer responsible for creating comprehensive website specifications.

Your task is to transform a rough website description into a detailed, actionable website creation prompt that a frontend developer could use to build the exact website envisioned.

WEBSITE TYPE: ${websiteType} - ${websiteTypeDetails[websiteType] || ""}
DESIGN STYLE: ${designStyle} - ${designStyleDetails[designStyle] || ""}${featuresSection}

YOUR OUTPUT MUST:
1. Begin with a concise 1-2 sentence overview of the website's purpose
2. Include detailed sections for:
   - Page Structure (all required pages with specific components for each)
   - Visual Design (color palette, typography, imagery style, UI components)
   - User Experience (navigation flow, interactions, accessibility requirements)
   - Technical Specifications (frameworks, libraries, APIs needed)
   - Content Requirements (text sections, media elements, data collection)
3. Add specific details missing from the original description but necessary for implementation
4. Be written in a clear, structured format with section headers
5. Use detailed, specific language instead of vague descriptions
6. Include appropriate technical terminology for developer implementation

Format your response as a comprehensive website development brief that could be presented to a web development team.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
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
