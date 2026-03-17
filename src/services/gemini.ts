import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, ORCHESTRATION_INSTRUCTION } from "./prompts";

const apiKey = process.env.GEMINI_API_KEY;

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: any;

  constructor() {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_PROMPT + "\n" + ORCHESTRATION_INSTRUCTION,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage({ message });
      return result.text || "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "عذراً، واجهت مشكلة في الاتصال. يرجى التحقق من اتصالك بالإنترنت.";
    }
  }

  async getStarterMessage(): Promise<string> {
    try {
      const result = await this.chat.sendMessage({ 
        message: "ابدأ المحادثة الآن بناءً على تعليمات STARTER_PROMPT" 
      });
      return result.text || "مرحباً! أنا هنا لمساعدتك في بناء مدونة ناجحة. هل لديك فكرة بالفعل أم تبحث عن واحدة؟";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "مرحباً! كيف يمكنني مساعدتك اليوم في التخطيط لمدونتك؟";
    }
  }
}

export const geminiService = new GeminiService();
