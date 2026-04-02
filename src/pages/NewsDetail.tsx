import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import type { NewsCardData } from '../types/news';
import { Header } from "../components/layout/Header"
//유틸리티
import { getTimeAgo } from "../utils/time";
import { getSourceName } from "../utils/format";

export const NewsDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsCardData | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id',id)
      .single();

      if (data) setNews(data);
    }
    fetchDetail();
  }, [id]);

  if (!news) {
    return <div className="p-10 text-center">로딩 중...</div>;
  }

  return (
    <>
    <Header type="detail" />
    <div className="relative px-4 py-6 pb-32 min-h-screen">
      {/* 태그 영역 */}
      <div className="flex flex-wrap items-center gap-2">
        {news.tickers?.map((t) => (
          <span key={t} className="px-3 h-7 leading-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-900">{news.tickers}</span>
        ))}
        {news.categories?.map((cate, index) => (
          <span key={index} className="text-xs text-gray-400">{cate}</span>
        ))}
        
      </div>

      {/* 제목 영역 */}
      <h2 className="mt-3.5 mb-4.5 text-2xl font-bold text-gray-900">{news.headline}</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{getSourceName(news.source_url)}</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-500">{getTimeAgo(news.published_at)}</span>
      </div>

      {/* 본문 영역 */}
      <div className="mt-5 text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{news.summary}</div>

      {/* 인사이트 영역 */}
      <div className="mt-8.5 p-5 rounded-2xl border border-solid border-blue-100 bg-[linear-gradient(117deg,rgba(239,246,255,1)_0%,rgba(250,245,255,1)_100%)]">
        <p className="mb-2 font-sm font-semibold text-gray-900">투자 인사이트</p>
        <div className="text-gray-600 text-sm">이 뉴스는 NVDA 종목에 긍정적인 영향을 미칠 것으로 예상됩니다. 추가 정보는 전문가 분석을 참고하세요.</div>
      </div>

      {/* 하단버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full min-w-80 max-w-107.5 z-50">
        <div className="flex gap-2 px-4 py-6 bg-linear-to-t from-white via-white/95 to-transparent">
          <button 
            onClick={() => window.open(news.source_url, '_blank')}
            className="flex-1 h-14 bg-blue-600 text-white rounded-xl font-semibold text-basic cursor-pointer"
          >
            자세히보기
          </button>
          <button
            onClick={() =>navigate(-1)}
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