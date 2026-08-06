import { ChatbotMessageRequest, ChatbotResponse } from "@/types";
import api from "./api";

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

export const ChatbotService = {
  sendChatMessage: async (
    data: ChatbotMessageRequest,
  ): Promise<ChatbotResponse> => {
    if (!CHATBOT_API_URL) throw new Error("CHATBOT_API_URL is not defined");

    try {
      const response = await api.post<ChatbotResponse>(CHATBOT_API_URL, data);
      return response.data;
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message to Chatbot";
      throw new Error(
        typeof detail === "string" ? detail : JSON.stringify(detail)
      );
    }
  },
};
