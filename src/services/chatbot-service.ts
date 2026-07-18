import { ChatbotMessageRequest, ChatbotResponse } from "@/types";
import { getAccessToken } from "@/actions/token";

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

export const ChatbotService = {
  sendChatMessage: async (
    data: ChatbotMessageRequest,
  ): Promise<ChatbotResponse> => {
    if (!CHATBOT_API_URL) throw new Error("CHATBOT_API_URL is not defined");

    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Sessão inválida: token de acesso em falta");
    }

    const response = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let detail = "Failed to send message to Chatbot";
      try {
        const errBody = await response.json();
        if (errBody?.detail) {
          detail =
            typeof errBody.detail === "string"
              ? errBody.detail
              : JSON.stringify(errBody.detail);
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(detail);
    }

    return response.json();
  },
};
