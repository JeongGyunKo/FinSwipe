import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { supabase } from '../lib/supabase';
import type { NewsCardData } from '../types/news';
import { Header } from "../components/layout/Header"
//유틸리티
import { getTimeAgo } from "../utils/time";
import { getSourceName } from "../utils/format";
//이미지
import defaultThumb from "../assets/thumb_img.jpg";

export const NewsDetail = () => {  

  const { id } = useParams();
  const navigate = useNavigate();  
  const location = useLocation();
  const groupTicker = location.state?.groupTicker;

  const articles: NewsCardData[] = useMemo(() => 
    location.state?.articles ?? [], 
    [location.state?.articles]
  );

  const news = useMemo(() => 
    articles.find(a => a.id === id) || null, 
    [articles, id]
  );

  const [showToast, setShowToast] = useState(false); 
  const currentIndex = articles.findIndex(a => a.id === id);

  useEffect(() => {  
    
    if (!news || !id) return;

    const markAsRead = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && id) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          await fetch(`${API_BASE_URL}/news/${id}/read?userId=${session.user.id}`, {
            method: 'POST',
          });
        } catch (err) {
          console.error("백엔드 읽음 처리 실패:", err);
        }
      }
    };
    markAsRead();

    // 로컬스토리지 저장
    const read = JSON.parse(localStorage.getItem('readNews') ?? '[]');
    if (!read.includes(id)) {
      localStorage.setItem('readNews', JSON.stringify([...read, id]));
    }
  }, [id, news]); 

  if (!news) {
    return <div className="p-10 text-center">로딩 중...</div>;
  }

  const handleNextNews = () => {
    const next = articles[currentIndex + 1];
    if (next) {
      navigate(`/detail/${next.id}`, { state: { groupTicker, articles } });
    } else {
      setShowToast(true);
      setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 2000);
    }
  };
  

  return (
    <>
    {/* 토스트 팝업 */}
    {showToast && (
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg animate-fade-in">
        오늘의 주요 뉴스를 모두 확인하셨습니다 🎉
      </div>
    )}
    <Header type="detail" />
    <div className='overflow-hidden relative h-68 bg-gray-100'>        
      {/* 이미지 */}
      <img src={news.imageUrl || defaultThumb} alt="" className='w-full h-full object-cover opacity-30'/>
      {/* 센티먼트, 티커 */}
      <div className="absolute left-0 bottom-0 p-5 flex flex-col gap-3">          
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 h-6 leading-6 rounded-full text-sm font-semibold ${
            news.sentimentLabel === 'positive' ? 'bg-emerald-50 text-[#22C55E]' : 
            news.sentimentLabel === 'negative' ? 'bg-rose-50 text-[#EF4444]' : 
            news.sentimentLabel === 'mixed' ? 'bg-yellow-50 text-[#F59E0B]' : 
            'bg-gray-100 text-gray-500' // Neutral
            }`}
          >
            {news.sentimentLabel}
          </span>
          {groupTicker && (
            <span className="px-3 h-6 leading-6 rounded-full text-white bg-gray-900 text-xs font-bold"> 
              {groupTicker}
            </span>
          )}
          {news.tickers?.filter(t => t !== groupTicker).map((t) => (
            <span key={t} className="px-3 h-6 leading-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-900">{t}</span>
          ))}
        </div>          
        {/* 제목 */}
        <h2 className="text-xl font-bold text-gray-900">{news.headlineKo}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{getSourceName(news.sourceUrl)}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{getTimeAgo(news.publishedAt)}</span>
        </div>
      </div>
    </div>
    <div className="relative px-4 py-8 pb-32 bg-gray-50 space-y-4">      

      {/* 3줄 요약 */}
      <div className="p-5 rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-bold text-gray-900">3줄 요약</p>
            <div className="flex items-center gap-1 h-8 px-3 rounded-lg bg-gray-100">
              <p className="text-sm font-medium text-gray-700">감성점수</p>
              <p className="text-sm font-bold text-gray-900">{Math.floor(news.sentimentScore * 100)}</p>
            </div>
        </div>        
        <ul className="flex flex-col gap-3">
          {news?.summary3linesKo?.map((line, idx) => {
            return (
              <li key={idx} className="flex gap-3 p-4 text-sm text-gray-700 border border-gray-200 rounded-[14px]">
                <span className="shrink-0 flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                  {idx+ 1}
                </span>
                {line}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 하이라이트 */}
      {news?.xaiKo && (
        <div className="p-5 rounded-2xl border border-gray-200 bg-white">
          <p className="mb-4 text-lg font-bold text-gray-900">하이라이트</p>
          <ul className="flex flex-col gap-4">
            {news?.xaiKo?.highlights.map((item, idx) => {
              const scorePercent = Math.round(item.relevance_score * 100);

              return (
                <li key={idx} className="flex flex-col p-4 gap-2 border border-gray-200 rounded-[14px] bg-gray-50">
                  <div className="flex gap-3 items-center">
                    <span className="w-3 h-3 text-[0px] rounded-full bg-green-500">dot</span>
                    <div className="relative grow h-2 rounded-full bg-gray-200 ">
                      <p 
                        className="absolute left-0 top-0 h-2 w-[90%] rounded-full bg-gray-900 transition-all duration-500"
                        style={{ width: `${scorePercent}%` }}
                      ></p>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">({scorePercent}%)</p>
                  </div>
                  <p className="pl-6 text-sm leading-relaxed text-gray-700">"{item.excerpt}"</p>
                </li>
              );
            })}          
          </ul>
        </div>
      )}

      {/* 본문 요약영역 */}
      <div className="p-5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{news.contentPreview}</div>

      {/* 하단버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 z-50">
        <div className="flex gap-2 px-4 py-6 bg-linear-to-t from-white via-white/95 to-transparent">
          <button 
            onClick={() => window.open(news.sourceUrl, '_blank')}
            className="flex-1 h-14 bg-blue-600 text-white rounded-xl font-semibold text-basic cursor-pointer"
          >
            자세히보기
          </button>
          <button
            onClick={handleNextNews}
            className="flex-1 h-14 bg-gray-100 text-gray-900 rounded-xl font-semibold text-basic cursor-pointer"
          >
            다음 뉴스
          </button>
        </div>
      </div>
    </div>
    </>
  );
};