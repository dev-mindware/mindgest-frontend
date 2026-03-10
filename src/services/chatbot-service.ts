import { ChatbotMessageRequest, ChatbotResponse } from "@/types";

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

export const ChatbotService = {
  sendChatMessage: async (
    data: ChatbotMessageRequest,
  ): Promise<ChatbotResponse> => {
    if (!CHATBOT_API_URL) throw new Error("CHATBOT_API_URL is not defined");

    const response = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Chatbot");
    }

    return response.json();
  },
};
