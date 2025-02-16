import { GoogleGenerativeAI } from "@google/generative-ai";
import { TelexMessage } from "../types";
import { config } from "dotenv";

config();

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: string = "gemini-pro";

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private buildContext(messages: TelexMessage[]): string {
    return messages.map((msg) => `${msg.sender}: ${msg.content}`).join("\n");
  }

  async getAnswer(question: string, messages: TelexMessage[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      let prompt = question;

      // Only add context if there are messages
      if (messages.length > 0) {
        const context = this.buildContext(messages);
        prompt = `
          You are TelexAI, a helpful and knowledgeable AI assistant for the Telex messaging app. Your role is to assist users by providing accurate, relevant, and engaging responses to their questions across any topic.

          Recent conversation context:
          ${context}

          User question: ${question}

          Please provide a helpful and natural response. Consider the conversation context when relevant, but you can also draw from your general knowledge to provide comprehensive answers. If the context doesn't contain relevant information for the specific question, simply answer based on your knowledge.

          Keep your responses:
          - Clear and concise
          - Friendly and conversational
          - Accurate and informative
          - Helpful and solution-oriented
        `;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error getting AI answer:", error);
      throw new Error("Failed to get AI response");
    }
  }
}
