import { useState, useRef, useEffect, useMemo } from "react";
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
  const [expandedAlertDates, setExpandedAlertDates] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 높이 자동 조절
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
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

      // sessionStorage에 기사 저장 후 홈으로 이동
      sessionStorage.setItem('alertArticle', JSON.stringify(article));
      navigate('/');
    } catch {
      alert("뉴스를 불러오지 못했습니다.");
    }
  };

  // messages를 렌더링하기 전에 alert 그룹화
  const groupedMessages = useMemo(() => {
    const result: (ChatMessage | { type: 'alert-group'; date: string; alerts: ChatMessage[] })[] = [];
    const alertGroups: { [date: string]: ChatMessage[] } = {};

    messages.forEach(msg => {
      if (msg.role === 'alert') {
        const date = new Date(msg.createdAt).toLocaleDateString('ko-KR');
        if (!alertGroups[date]) alertGroups[date] = [];
        alertGroups[date].push(msg);
      }
    });

    const processedDates = new Set<string>();

    messages.forEach(msg => {
      if (msg.role === 'alert') {
        const date = new Date(msg.createdAt).toLocaleDateString('ko-KR');
        if (!processedDates.has(date)) {
          processedDates.add(date);
          result.push({ type: 'alert-group', date, alerts: alertGroups[date] });
        }
      } else {
        result.push(msg);
      }
    });

    return result;
  }, [messages]);

  // alert 펼침
  const toggleAlertGroup = (date: string) => {
    setExpandedAlertDates(prev => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
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

          {groupedMessages.map((item) => {
            // alert 그룹
            if ('type' in item && item.type === 'alert-group') {
              const isExpanded = expandedAlertDates.has(item.date);
              return (
                <div key={`alert-group-${item.date}`} className="flex justify-center">
                  <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
                    {/* 요약 헤더 */}
                    <button
                      onClick={() => toggleAlertGroup(item.date)}
                      className="w-full flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🔔</span>
                        <span className="text-sm font-semibold text-amber-800">
                          {item.alerts.length}개의 주요 뉴스 알림이 있었어요
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-500">{item.date}</span>
                        <span className="text-amber-600 text-sm">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* 확인 버튼 */}
                    {!isExpanded && (
                      <div className="px-4 pb-3">
                        <button
                          onClick={() => toggleAlertGroup(item.date)}
                          className="w-full py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-semibold"
                        >
                          확인해 보시겠어요?
                        </button>
                      </div>
                    )}

                    {/* 펼쳐진 alert 목록 */}
                    {isExpanded && (
                      <div className="flex flex-col divide-y divide-amber-200 border-t border-amber-200">
                        {item.alerts.map(alert => (
                          <div
                            key={alert.id}
                            onClick={() => alert.articleId && handleAlertClick(alert.articleId)}
                            className="px-3 py-2.5 cursor-pointer active:opacity-80"
                          >
                            <div className="flex items-center justify-between mb-1">
                              {alert.ticker && (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full break-all max-w-[75%]">
                                  {alert.ticker}
                                </span>
                              )}
                              <time className="text-[10px] text-amber-400 ml-auto">{formatTime(alert.createdAt)}</time>
                            </div>
                            <p className="text-sm text-amber-900 leading-relaxed">{alert.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // 일반 메시지
            const msg = item as ChatMessage;
            const isMe = msg.role === "user";
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
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
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요."
              rows={1}
              maxLength={500}
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50 resize-none overflow-hidden leading-relaxed"
              style={{ minHeight: '44px', maxHeight: '120px' }}                       
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