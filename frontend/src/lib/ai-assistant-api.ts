import { api } from "@/lib/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const askAssistant = async (message: string, history: ChatMessage[]): Promise<string> => {
  const { data } = await api.post("/ai-assistant/ask", { message, history });
  return data.reply;
};
