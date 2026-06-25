import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "../types/chat";
//컴포넌트
import { Header } from "../components/layout/Header";
import { DialMenu } from "../components/layout/DialMenu";


export const Chat = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 히스토리 불러오기
  const fetchMessages = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages?limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("히스토리 불러오기 실패");
      const data = await response.json();
      // 최신순으로 오므로 역순으로 표시
      setMessages([...(data.messages ?? [])].reverse());
    } catch (error) {
      console.error("메시지 히스토리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const accessToken = localStorage.getItem("accessToken");
    const content = input.trim();
    setInput("");
    setIsSending(true);

    // 유저 메시지 임시 추가
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      is_read: true,
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("전송 실패");

      // 전송 후 히스토리 다시 불러오기 (AI 응답 포함)
      await fetchMessages();
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleAlertClick = async (articleId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/news/article/${articleId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 404) {
        alert("삭제되었거나 만료된 뉴스입니다.");
        return;
      }
      if (!response.ok) throw new Error();
      const article = await response.json();
      navigate(`/detail/${articleId}`, {
        state: {
          articles: [article],  // 배열로 감싸서 전달
          groupTicker: article.tickers?.[0] ?? '',
        }
      });
    } catch {
      alert("뉴스를 불러오지 못했습니다.");
    }
  };
  

  return (
    <>
      <Header type="sub" title="AI 챗봇" />
      <div className="flex flex-col bg-gray-50" style={{ height: "calc(100dvh - 72px)" }}>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {isLoading && (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
              불러오는 중...
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <p className="text-sm">무엇이든 물어보세요!</p>
              <p className="text-xs">금융 뉴스, 종목, 투자에 대해 답변해드릴게요.</p>
            </div>
          )}

          {messages.map((msg) => {
            // alert 타입
            if (msg.role === "alert") {
              return (
                <div key={msg.id} className="flex grow w-full">
                  <div
                    onClick={() => msg.articleId && handleAlertClick(msg.articleId)}
                    className="w-full rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden cursor-pointer active:opacity-80"
                  >
                    {/* 상단 헤더 */}
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-amber-100 border-b border-amber-200">
                      <span className="text-xs font-bold text-amber-700">🔔 감성 알림</span>
                      {msg.ticker && (
                        <span className="ml-auto text-xs font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                          ${msg.ticker}
                        </span>
                      )}
                    </div>
                    {/* 본문 */}
                    <div className="px-3 py-2.5">
                      <p className="text-sm text-amber-900 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    {/* 시간 */}
                    <div className="px-3 pb-2">
                      <time className="text-[10px] text-amber-400">{formatTime(msg.createdAt)}</time>
                    </div>
                  </div>
                </div>
              );
            }

            const isMe = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
              >
                {!isMe && (
                  <p className="text-xs text-gray-400 pl-1">AI 어시스턴트</p>
                )}
                <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <time className="text-[10px] text-gray-400 shrink-0">
                    {formatTime(msg.createdAt)}
                  </time>
                </div>
              </div>
            );
          })}

          {/* AI 응답 로딩 */}
          {isSending && (
            <div className="flex items-start gap-2">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요."
              className="flex-1 h-11 px-4 text-sm rounded-xl border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50"              
              maxLength={500}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="shrink-0 h-11 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
            >
              전송
            </button>
          </div>
        </div>
      </div>
      <DialMenu />
    </>
  );
};