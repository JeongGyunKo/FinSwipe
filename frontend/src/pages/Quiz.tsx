import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
//컴포넌트
import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation"
//이미지
import checkIcon from "../assets/ic_check.svg";
import errorIcon from "../assets/ic_error.svg";

export const Quiz = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<{
    question_id: string;
    question_number: number;
    question_text: string;
    choices: Record<string, string>;
    question_type: string;
  } | null>(null);

  useEffect(() => {
    const startQuiz = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      

      // 1단계: 세션 생성
      const sessionResponse = await fetch(`${API_BASE_URL}/quiz/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userId ? { user_id: userId } : {}),
      });
      const sessionData = await sessionResponse.json();
      //console.log("세션 생성 응답:", sessionData);
      setSessionId(sessionData.session_id);

      // 2단계: 첫 번째 문제 요청
      const questionResponse = await fetch(
        `${API_BASE_URL}/quiz/sessions/${sessionData.session_id}/next-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const questionData = await questionResponse.json();
      //console.log("문제 응답:", questionData);
      setQuestion(questionData);
    };

    startQuiz();
  }, []);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    session_status: string;
  } | null>(null);
  const [finalResult, setFinalResult] = useState<{
    tendency?: string;
    tendency_emoji?: string;
    tendency_description?: string;
    analysis_hints?: string[];
    strongest_area?: string;
    area_stats?: Record<string, { score: number; correct: number; total: number }>;
  } | null>(null);

  const handleAnswer = async (label: string) => {
    if (answerResult) return;
    setSelectedAnswer(label);

    const accessToken = localStorage.getItem("accessToken");
    //const body = { answer: label };
    //console.log("보내는 데이터:", body);

    const response = await fetch(
      `${API_BASE_URL}/quiz/sessions/${sessionId}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ answer: label }),
      }
    );
    const data = await response.json();
    //console.log("답변 응답:", data);
    setAnswerResult(data);

    // 퀴즈 완료 시
    if (data.session_status === "completed") {      
      setFinalResult(data);
    }
  };

  const handleNextQuestion = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const questionResponse = await fetch(
      `${API_BASE_URL}/quiz/sessions/${sessionId}/next-question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const questionData = await questionResponse.json();
    //console.log("다음 문제 응답:", questionData);
    setQuestion(questionData);

    // 답변 상태 초기화
    setSelectedAnswer(null);
    setAnswerResult(null);
  };

  const areaConfig = [
    { key: '기본개념', color: 'bg-blue-500', desc: '주식·채권·ETF의 의미, 주주 개념, 시장 구조 등 투자의 첫 걸음이 되는 기초 지식' },
    { key: '마켓수급', color: 'bg-purple-500', desc: '거래량·수급 흐름, RSI·MACD 등 기술적 신호, 어닝 서프라이즈와 선반영 원리' },
    { key: '매크로', color: 'bg-orange-500', desc: '기준금리·환율·GDP·인플레이션 등 거시경제 변수가 주가에 미치는 영향' },
    { key: '펀더멘털', color: 'bg-green-500', desc: 'PER·PBR·ROE·EPS 등 재무지표로 기업 내재가치를 분석하는 능력' },
    { key: '리스크관리', color: 'bg-red-500', desc: '베타계수·변동성·포트폴리오 분산·손절매 등 손실 방어 전략' },
  ];

  const radarData = areaConfig.map(({ key }) => ({
    subject: key,
    score: finalResult?.area_stats?.[key]?.score ?? 0,
    fullMark: 5,
  }));

  // 결과 화면
  if (finalResult) {
    return (      
      <>
        <Header type="sub" title="퀴즈 결과" />
        <div className="flex flex-col items-center px-4 py-6 gap-6 text-center">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400">나의 투자 스냅을 분석했어요</p>
            <div className="flex gap-2">
              <p className="text-xl">{finalResult.tendency_emoji}</p>
              <p className="text-xl font-bold text-gray-900">{finalResult.tendency}</p>              
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} outerRadius={80}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                dataKey="subject"
                tick={({ x, y, payload, index }) => {
                  const score = radarData[index]?.score ?? 0;
                  return (
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
                      <tspan x={x} dy="-0.5em" fontSize={10} fontWeight="500" fill="#374151">{payload.value}</tspan>
                      <tspan x={x} dy="1.3em" fontSize={9} fontWeight="700" fill="#0064FF">{score}/5</tspan>
                    </text>
                  );
                }}
              />
              <Radar 
                dataKey="score"
                fill="#0064FF"
                fillOpacity={0.12}
                stroke="#0064FF"
                strokeWidth={2}
                dot={{ fill: "#2563eb", r: 2 }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="w-full p-4 rounded-[14px] border border-emerald-100 bg-emerald-50">
            <p className="text-sx font-semibold text-emerald-600">💪 강한 영역</p>
            <p className="text-base font-bold text-gray-900">{finalResult.strongest_area}</p>
          </div>
          <p className="text-xs text-gray-400">영역별 분석</p>
          <ul className="w-full space-y-4">
            {areaConfig.map(({ key, color, desc }) => {
              const stat = finalResult?.area_stats?.[key];
              const score = stat?.score ?? 0;
              return (
                <li key={key} className="space-y-1.5 text-left">
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-bold text-gray-800">{key}</p>
                    <p className="text-xs font-semibold text-gray-500">{score}/5</p>
                  </div>
                  <div className="overflow-hidden w-full h-1.5 rounded-xl bg-gray-100">
                    <p
                      className={`h-1.5 ${color}`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    ></p>
                  </div>
                  <p className="text-xs text-gray-400">{desc}</p>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={() => navigate("/")}
              className="w-full h-14 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base"
            >
              뉴스보기
            </button>  <button
              onClick={handleNextQuestion}
              className="w-full h-14 bg-blue-600 text-white rounded-xl font-semibold text-base"
            >
              심화퀴즈
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header type="main" />
      <div className="px-4 pb-40 space-y-4">
        <div className="flex items-center gap-2 pt-6">
          <div className="relative grow h-2 rounded-2xl bg-gray-100">
            <p 
              className="absolute h-2 rounded-2xl bg-blue-600"
              style={{ width: `${((question?.question_number ?? 1) / 10) * 100}%` }}
            ></p>
          </div>
          <p className="text-gray-500 text-sm">{question?.question_number} / 10</p>
        </div>
        <h3 className="text-xl font-bold">{question?.question_text}</h3>
        <ul className="flex flex-col gap-4 pt-2">
          {question && Object.entries(question.choices).map(([label, text]) => (
            <li
              key={label}
              onClick={() => handleAnswer(label)}
              className={`flex justify-between items-center gap-3 p-4 min-h-12 rounded-[14px] border text-base font-medium cursor-pointer
              ${!answerResult ? 'border-gray-200 text-gray-700' :
                label === answerResult.correct_answer ? 'bg-green-50 border-green-500 text-green-700' :
                label === selectedAnswer ? 'bg-red-50 border-red-500 text-red-700' :
                'border-gray-200 text-gray-700'
              }`}
            >
              {text}
              {answerResult && label === answerResult.correct_answer && <img src={checkIcon} alt="" className="w-5 h-5" />}
              {answerResult && label === selectedAnswer && label !== answerResult.correct_answer && <img src={errorIcon} alt="" className="w-5 h-5" />}
            </li>
          ))}
        </ul>
        {answerResult && (
          <div className={`p-4 rounded-[14px] border text-sm text-gray-700 leading-relaxed ${
            answerResult.is_correct ? 'bg-green-50 border-green-500' : 'border-red-200 bg-red-50'
          }`}>
            <p className={`text-sm font-semibold ${
              answerResult.is_correct ? 'text-green-700' : 'text-red-700'
            }`}>
              {answerResult.is_correct ? "정답입니다 ✓" : "아쉬워요!"}
            </p>
            {answerResult.explanation}
          </div>
        )}
        {answerResult && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 p-4 bg-white border-t border-gray-100">
            <button 
              onClick={handleNextQuestion}
              className="w-full h-12 rounded-xl bg-blue-600 text-base text-white font-semibold">
              다음 문제
            </button>
          </div>
        )}
      </div>
      <Navigation />
    </>
  );
};