import { GoogleGenAI } from "@google/genai";
import { BrandCheckResult, ProductType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility to pause execution
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wraps an async operation with exponential backoff retry logic.
 * Specifically targets 429 (Too Many Requests) and 503 (Service Unavailable).
 */
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> {
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check for Quota (429) or Server Overload (503)
      const isQuotaError = error.toString().includes('429') || error.status === 429 || error.message?.includes('Resource has been exhausted');
      const isServerOverload = error.status === 503;

      if (isQuotaError || isServerOverload) {
        if (i < retries - 1) {
          // Exponential backoff: 1s, 2s, 4s...
          const delay = baseDelay * Math.pow(2, i);
          console.warn(`Gemini API busy/limited (Attempt ${i + 1}/${retries}). Retrying in ${delay}ms...`);
          await wait(delay);
          continue;
        } else {
           // Final attempt failed
           if (isQuotaError) {
             throw new Error("⚠️ Google AI Quota Exhausted. \n\nLimit reached (429). \n- If this is a speed limit, wait 1 minute.\n- If this is a daily limit, try again tomorrow.");
           }
        }
      }
      // If it's not a retriable error (like 400 Bad Request or 401 Invalid Key), throw immediately
      throw error;
    }
  }
  throw lastError;
}

export const checkBrandAvailability = async (
  brandName: string,
  productType: ProductType,
  context: string = ""
): Promise<BrandCheckResult> => {
  return retryOperation(async () => {
    try {
      const isAllPlatforms = productType === ProductType.ALL;
      
      const productContext = isAllPlatforms 
        ? "All Platforms (Web, Mobile App Stores (iOS/Android), Chrome Web Store, Social Media, Desktop Software)" 
        : productType;

      const marketAnalysisInstruction = isAllPlatforms
        ? "(Analyze the name's distinctiveness. You MUST specifically mention findings across App Stores (Google Play/App Store), Chrome Web Store, and general Web usage.)"
        : `(Analyze the name's distinctiveness, current usage in the ${productType} sector, and potential trademark conflicts found on the web.)`;

      const prompt = `
        Perform a comprehensive global brand availability check and analysis for the name: "${brandName}".
        Product Type: ${productContext}.
        Context/Description: ${context || "N/A"}.

        Please structure your response using the following Markdown headers:
        
        # 🛡️ Availability Verdict
        (Start with a clear verdict: Highly Available, Moderately Available, Risky, or Taken. Explain briefly.)

        # 🔍 Market Analysis
        ${marketAnalysisInstruction}

        # 🌐 Domain & Social
        (Discuss the likelihood of .com domain availability and common social handles based on your search findings.)

        # ⚔️ Potential Conflicts
        (List specific existing entities, apps, or websites that share this name or are very similar.)

        # 💡 Creative Alternatives
        (Suggest 5 alternative names if this one is taken, or variations that might be safer.)

        Use a professional, analytical tone.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No analysis generated.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] || [];

      return {
        text,
        groundingChunks
      };

    } catch (error: any) {
      console.error("Gemini API Error details:", error);
      // Pass through for the retry wrapper to handle
      throw error;
    }
  });
};

export const generateBrandNames = async (
  productType: ProductType,
  context: string,
  seedName: string = ""
): Promise<BrandCheckResult> => {
  return retryOperation(async () => {
    try {
      const prompt = `
        You are a creative brand naming consultant.
        Task: Generate 10 unique, modern, and likely available brand names for a ${productType}.
        
        Context/Description: ${context || "A generic modern product in this category."}
        ${seedName ? `Inspiration/Seed Word: "${seedName}"` : ""}

        Requirements:
        1. Names should be catchy, memorable, and easy to spell.
        2. Implicitly check for obvious conflicts and prioritize names that seem 'clean'.
        3. Include a mix of abstract, compound, and descriptive names.

        Please structure your response using the following Markdown headers:

        # ✨ Recommended Names
        (List the 10 names using numbered lists. Format: **Name** - Brief rationale and estimated availability confidence.)

        # 🧠 Naming Strategy
        (Briefly explain the angles or themes you used to generate these names based on the context.)

        # 🌐 Domain Availability Checks
        (Provide general advice on domain extensions (.com, .io, .ai) suitable for these types of names.)

        Use a creative and encouraging tone.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No names generated.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] || [];

      return {
        text,
        groundingChunks
      };

    } catch (error: any) {
      console.error("Gemini API Error details:", error);
      throw error;
    }
  });
};