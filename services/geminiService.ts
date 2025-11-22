import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudyPlan, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Use Search Grounding to get the raw text data about the user.
 * We cannot use JSON schema here because Search tool doesn't support it combined with Schema.
 */
export const fetchUserProfileData = async (username: string): Promise<{ text: string; sources: string[] }> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Search for the LeetCode profile of user '${username}' (url: https://leetcode.com/u/${username}/).
      Find their total solved count, breakdown by difficulty (Easy/Medium/Hard), global ranking, and recent solved problems or topics they focus on.
      Also look for any specific "Recent AC" (Recent Accepted) problems visible in search snippets.
      Summarize this information in detail.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No details found.";
    
    // Extract grounding chunks (URLs)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch public profile data. Please check the username.");
  }
};

/**
 * Step 2: Use the raw text to generate a structured JSON study plan.
 * We use the thinking model (or standard flash with schema) to process the gathered info.
 */
export const generateStructuredPlan = async (username: string, profileContext: string, sources: string[]): Promise<StudyPlan> => {
  const model = "gemini-2.5-flash";
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      stats: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          totalSolved: { type: Type.NUMBER },
          easySolved: { type: Type.NUMBER },
          mediumSolved: { type: Type.NUMBER },
          hardSolved: { type: Type.NUMBER },
          ranking: { type: Type.STRING },
          topSkills: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
        },
        required: ["username", "totalSolved", "easySolved", "mediumSolved", "hardSolved", "topSkills"],
      },
      reviewList: {
        type: Type.ARRAY,
        description: "List of 5-7 problems the user likely solved (based on context or typical progression) that are worth reviewing.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            topic: { type: Type.STRING },
            reason: { type: Type.STRING, description: "Why review this? e.g., 'Common interview follow-up'." },
            highFailureRate: { type: Type.BOOLEAN, description: "True if this problem is known for having tricky edge cases or low acceptance." },
            acceptanceRate: { type: Type.STRING, description: "Approximate percentage, e.g., '34%'" },
          },
          required: ["title", "difficulty", "topic", "reason", "highFailureRate"],
        },
      },
      recommendations: {
        type: Type.ARRAY,
        description: "List of 5 NEW problems based on the user's level.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            topic: { type: Type.STRING },
            reason: { type: Type.STRING },
            highFailureRate: { type: Type.BOOLEAN },
            acceptanceRate: { type: Type.STRING },
          },
          required: ["title", "difficulty", "topic", "reason"],
        },
      },
      analysis: { type: Type.STRING, description: "A brief motivational summary and analysis of their stats." },
    },
    required: ["stats", "reviewList", "recommendations", "analysis"],
  };

  const prompt = `
    You are an expert LeetCode coach.
    
    Here is the gathered context about user '${username}':
    ${profileContext}
    
    If the context is vague or missing specific numbers, estimate reasonable stats for a typical active user or use 0 if completely unknown, but prioritize any real numbers found.
    
    Task:
    1. Parse/Estimate the stats.
    2. Create a 'Review List': Identify standard or tricky problems that a user with this profile *likely* solved. Flag problems as 'highFailureRate' if they are known to have low acceptance rates (e.g. < 40%) or tricky edge cases (like 'LRU Cache', 'Median of Two Sorted Arrays', 'Trapping Rain Water').
    3. Create 'Recommendations': Suggest the next logical problems to solve to improve their weak spots.
    4. Write a short analysis.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const data = JSON.parse(response.text) as StudyPlan;
  data.groundingUrls = sources;
  return data;
};
