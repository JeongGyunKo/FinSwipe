import { useNavigate } from "react-router-dom";
import type { NewsCardData } from '../../types/news';
import { useCardImpression } from "../../hooks/useCardImpression";
import { trackEvent } from "../../lib/analytics/events";
//유틸리티
import { getTimeAgo } from "../../utils/time";
import { getSourceName } from "../../utils/format";
//이미지
import clock from '../../assets/ic_clock.svg';
import defaultThumb from "../../assets/thumb_img.jpg";


export const SwipeCard = ({ data, groupTicker, articles, index  }: { 
  data: NewsCardData;
  groupTicker: string;
  articles: NewsCardData[];
  index: number;
  }) => {

  const navigate = useNavigate();

  // --- GA4 데이터 구성 ---
  const gaData = {
    news_id: data.id,
    ticker: groupTicker,
    sentiment_label: data.sentimentLabel as any,
    sentiment_score: data.sentimentScore ?? 0, // 데이터에 점수가 있다면 넣고 없으면 0
    card_index: index + 1, // 보통 분석 시에는 1부터 시작하는 걸 선호합니다.
    deck_size: articles.length,
    is_push_entry: false, // 진입 경로 로직에 따라 수정 가능
  }

  // [B-04] 카드 노출 추적 (50% 이상, 1초 대기)
  const cardRef = useCardImpression(gaData);

  const handleCardClick = () => {
    // [B-06] 카드 탭(클릭) 이벤트 발화
    trackEvent("card_tapped", {
      news_id: data.id,
      ticker: groupTicker,
      sentiment_label: data.sentimentLabel,
      card_index: index + 1
    });

    console.log('groupTicker:', groupTicker, articles);
    navigate(`/detail/${data.id}`, { state: {groupTicker, articles} });
  };

  const isRead = !!data.is_read;

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`overflow-hidden relative w-full items-start bg-white rounded-3xl border border-solid border-gray-200
        ${isRead ? 'opacity-40 grayscale-20' : 'opacity-100'}
      `}>
      {/* 이미지 */}
      <div className='overflow-hidden h-40 bg-gray-100'>
        <img src={data.imageUrl || defaultThumb} alt="" className='w-full h-full object-cover'/>
      </div>

      {/* 상단 티커 정보 */}
      <div className='before-empty absolute top-0 left-0 w-full p-3 flex justify-between items-center'>
        <div className="relative flex items-center gap-2">
          {/* <span className='h-5 px-2.5 rounded-full bg-white/90 leading-5 text-xs font-semibold text-gray-900'>
            {data.ticker_names?.[0]?.ko ?? data.tickers[0]}
          </span>
          <span className={`w-2 h-2 rounded-full text-[0px] ${
            data.sentiment_label === 'positive' ? 'bg-[#22C55E]' : 
            data.sentiment_label === 'negative' ? 'bg-[#EF4444]' : 
            data.sentiment_label === 'mixed' ? 'bg-[#F59E0B]' : 
            'bg-[#9CA3AF]' // Neutral 또는 기본값
          }`}>{data.sentiment_label}</span> */}
        </div>        
        <span className='relative flex gap-1 text-white/90 text-xs'>
          <img src={clock} alt="" />
          {getTimeAgo(data.publishedAt)}
        </span>
      </div>

      {/* 중앙 텍스트 내용 */}
      <div className='flex flex-col gap-2 h-33 p-4'>
        <div className="flex items-center gap-2">
          <span className={`px-2 h-5 rounded-sm text-sm font-medium ${
            data.sentimentLabel === 'positive' ? 'bg-emerald-50 text-[#22C55E]' : 
            data.sentimentLabel === 'negative' ? 'bg-rose-50 text-[#EF4444]' : 
            data.sentimentLabel === 'mixed' ? 'bg-yellow-50 text-[#F59E0B]' : 
            'bg-gray-100 text-gray-500' // Neutral
            }`}
          >
            {data.sentimentLabel}
          </span>
          {data.categories.map((cate, index) => (
            <span key={index} className='text-xs text-gray-400'>{cate}</span>
          ))}  
        </div>
        <div className='text-gray-900 text-4 font-bold line-clamp-1'>{data.headlineKo}</div>
        <div className="text-sm text-gray-600 line-clamp-2">{data.summary3linesKo?.[0] ?? ""}</div>
        
      </div>

      {/* 하단 출처 자세히보기 */}
      <div className='flex justify-between items-center p-4 border-t border-solid border-gray-200'>
        <div className="text-xs text-gray-500">{getSourceName(data.sourceUrl)}</div> 
        <div className='px-3 py-1.5 text-xs text-blue-600 font-semibold cursor-pointer'>자세히 보기 →</div>
      </div>
    </div>
  );
};