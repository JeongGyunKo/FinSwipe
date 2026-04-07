import type { NewsCardData } from '../../types/news';
//유틸리티
import { getTimeAgo } from "../../utils/time";
import { getSourceName } from "../../utils/format";
//이미지
import clock from '../../assets/ic_clock.svg';
import defaultThumb from "../../assets/thumb_img.jpg";


export const SwipeCard = ({ data }: { data: NewsCardData }) => {

  return (
    <div className='overflow-hidden relative w-full items-start bg-white rounded-3xl border border-solid border-gray-200'>
      {/* 이미지 */}
      <div className='overflow-hidden h-40 bg-gray-100'>
        <img src={data.image_url || defaultThumb} alt="" className='w-full h-full object-cover'/>
      </div>

      {/* 상단 티커 정보 */}
      <div className='before-empty absolute top-0 left-0 w-full p-3 flex justify-between items-center'>
        <div className="relative flex items-center gap-2">
          <span className='h-5 px-2.5 rounded-full bg-white/90 leading-5 text-xs font-semibold text-gray-900'>{data.tickers}</span>
          <span className={`w-2 h-2 rounded-full text-[0px] ${
            data.sentiment_label === 'positive' ? 'bg-[#22C55E]' : 
            data.sentiment_label === 'negative' ? 'bg-[#EF4444]' : 
            data.sentiment_label === 'mixed' ? 'bg-[#F59E0B]' : 
            'bg-[#9CA3AF]' // Neutral 또는 기본값
          }`}>{data.sentiment_label}</span>
        </div>        
        <span className='relative flex gap-1 text-white/90 text-xs'>
          <img src={clock} alt="" />
          {getTimeAgo(data.published_at)}
        </span>
      </div>

      {/* 중앙 텍스트 내용 */}
      <div className='flex flex-col gap-2 h-63 p-4'>
        <div className="flex items-center gap-2">
          <span className={`px-2 h-5 rounded-sm text-sm font-medium ${
            data.sentiment_label === 'positive' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
            data.sentiment_label === 'negative' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 
            data.sentiment_label === 'mixed' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 
            'bg-gray-100 text-gray-500' // Neutral
            }`}
          >
          {data.sentiment_label}
        </span>
        {data.categories.map((cate, index) => (
          <span key={index} className='text-xs text-gray-400'>{cate}</span>
        ))}  
        </div>
        <div className='text-gray-900 text-4 font-bold'>{data.headline}</div>
        {data.summary_3lines.map((line, index) => (
          <div key={index} className="text-sm text-gray-600 line-clamp-2">{line}</div>
        ))}
        
      </div>

      {/* 하단 출처 자세히보기 */}
      <div className='flex justify-between items-center p-4 border-t border-solid border-gray-200'>
        <div className="text-xs text-gray-500">{getSourceName(data.source_url)}</div> 
        <div onClick={() => window.open(data.source_url, '_blank')} className='px-3 py-1.5 text-xs text-blue-600 font-semibold cursor-pointer'>자세히 보기 →</div>
      </div>
    </div>
  );
};