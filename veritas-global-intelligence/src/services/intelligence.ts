import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, NewsArticle } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

const mask = (key: string | undefined) => {
  if (!key) return 'MISSING';
  if (key.length < 8) return 'TOO_SHORT';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

console.log("Gemini Node Config Check:", mask(API_KEY));

/**
 * Truth Index Scoring Engine
 * Combines credibility, bot risk, and sentiment into a normalized 0-100 score.
 */
export const calculateTruthIndex = (
  credibility: number, 
  botRisk: number, 
  sentiment: 'positive' | 'neutral' | 'negative'
): number => {
  // Weights for the scoring engine
  const CREDIBILITY_WEIGHT = 0.6;
  const BOT_RISK_WEIGHT = 0.3;
  const SENTIMENT_WEIGHT = 0.1;

  // Invert bot risk (higher risk = lower truth index)
  const botFactor = 100 - botRisk;

  // Sentiment factor: Neutral is preferred for objective news
  let sentimentFactor = 100;
  if (sentiment !== 'neutral') {
    // Extreme sentiment often correlates with bias or sensationalism
    sentimentFactor = 80; 
  }

  const score = 
    (credibility * CREDIBILITY_WEIGHT) + 
    (botFactor * BOT_RISK_WEIGHT) + 
    (sentimentFactor * SENTIMENT_WEIGHT);

  return Math.round(Math.max(0, Math.min(100, score)));
};

export const analyzeArticle = async (article: NewsArticle): Promise<IntelligenceReport> => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analyze the following news article for credibility and potential misinformation.
    Title: ${article.title}
    Source: ${article.source.name}
    Description: ${article.description}
    Content: ${article.content}

    Provide a structured analysis including:
    1. Credibility Score (0-100): How reliable is this source and content?
    2. Bot Likelihood (0-100): How likely is this part of a coordinated bot campaign?
    3. Sentiment: positive, neutral, or negative.
    4. Summary: A concise 2-sentence summary.
    5. Reasoning: Brief explanation for the scores.
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    console.log(`Analyzing article with Gemini: ${article.title.substring(0, 50)}...`);
    const startTime = Date.now();
    const responsePromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            credibilityScore: { type: Type.NUMBER },
            botLikelihood: { type: Type.NUMBER },
            sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
            summary: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["credibilityScore", "botLikelihood", "sentiment", "summary", "reasoning"],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Gemini Analysis Timeout")), 15000)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]);
    clearTimeout(timeout);
    const duration = Date.now() - startTime;
    console.log(`Gemini analysis completed in ${duration}ms for: ${article.title.substring(0, 30)}`);

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    // Calculate Truth Index using the scoring engine
    const truthIndex = calculateTruthIndex(
      result.credibilityScore, 
      result.botLikelihood, 
      result.sentiment
    );

    return {
      ...result,
      truthIndex
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      credibilityScore: 50,
      botLikelihood: 10,
      sentiment: "neutral",
      truthIndex: 67, // Default for 50 cred, 10 bot, neutral sentiment
      summary: "Analysis unavailable.",
      reasoning: "Failed to connect to intelligence engine.",
    };
  }
};

export const translateArticle = async (article: NewsArticle): Promise<NewsArticle> => {
  if (!API_KEY) return article;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Translate the following news article title and description into English if they are not already in English.
    If they are already in English, return them exactly as they are.
    
    Title: ${article.title}
    Description: ${article.description || ""}
    
    Provide the translation in JSON format:
    {
      "title": "translated title",
      "description": "translated description"
    }
  `;

  try {
    console.log(`Translating article: ${article.title.substring(0, 50)}...`);
    const startTime = Date.now();
    // Add a timeout to the translation request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout per translation

    const responsePromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Translation Timeout")), 10000)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]);
    
    clearTimeout(timeout);
    const duration = Date.now() - startTime;
    console.log(`Translation completed in ${duration}ms for: ${article.title.substring(0, 30)}`);
    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);
    
    return {
      ...article,
      title: result.title || article.title,
      description: result.description || article.description,
    };
  } catch (error) {
    console.warn("Translation Error or Timeout:", error);
    return article;
  }
};

export const analyzeWithGrok = async (article: NewsArticle): Promise<IntelligenceReport> => {
  const GROK_KEY = process.env.GROK_API_KEY;
  if (!GROK_KEY || GROK_KEY === 'MY_GROK_API_KEY') {
    throw new Error("GROK_API_KEY not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    console.log(`Analyzing article with Grok: ${article.title.substring(0, 50)}...`);
    const startTime = Date.now();
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are a global intelligence analyst. Provide a structured JSON analysis of news articles."
          },
          {
            role: "user",
            content: `Analyze this article: ${article.title}. Source: ${article.source.name}. Content: ${article.description}. Return JSON with credibilityScore (0-100), botLikelihood (0-100), sentiment (positive/neutral/negative), summary (2 sentences), and reasoning.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    clearTimeout(timeout);
    const duration = Date.now() - startTime;
    console.log(`Grok analysis completed in ${duration}ms for: ${article.title.substring(0, 30)}`);

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Calculate Truth Index using the scoring engine
    const truthIndex = calculateTruthIndex(
      result.credibilityScore, 
      result.botLikelihood, 
      result.sentiment
    );

    return {
      ...result,
      truthIndex
    };
  } catch (error) {
    console.error("Grok Analysis Error:", error);
    return {
      credibilityScore: 50,
      botLikelihood: 10,
      sentiment: "neutral",
      truthIndex: 67,
      summary: "Grok analysis unavailable.",
      reasoning: "Failed to connect to xAI engine.",
    };
  }
};
