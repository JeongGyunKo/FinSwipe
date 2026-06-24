const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "alert";
  content: string;
  ticker?: string | null;
  articleId?: string | null;
  createdAt: string;
  is_read: boolean;
}

export const getUnreadCount = async (): Promise<number> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return 0;

  try {
    const response = await fetch(`${API_BASE_URL}/chat/messages?limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return (data.messages ?? []).filter((m: ChatMessage) => !m.is_read).length;
  } catch {
    return 0;
  }
};