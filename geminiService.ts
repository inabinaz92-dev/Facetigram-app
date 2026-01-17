
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const geminiService = {
  async generateCaption(topic: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a creative social media caption for a post about: ${topic}. Include 3 relevant hashtags.`,
      });
      return response.text || "Failed to generate caption.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Something went wrong with the AI service.";
    }
  },

  async suggestReply(comment: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a friendly and engaging reply to this social media comment: "${comment}"`,
      });
      return response.text || "Cool!";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Thanks for the comment!";
    }
  }
};
