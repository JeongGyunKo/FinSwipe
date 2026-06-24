import { useNavigate } from "react-router-dom";
import type { NewsCardData } from '../../types/news';
//유틸리티
import { getTimeAgo } from "../../utils/time";
//이미지
import defaultThumb from "../../assets/thumb_img.jpg";


export const Article = ({ data, groupTicker, articles }: { 
  data: NewsCardData;
  groupTicker: string;
  articles: NewsCardData[];
  index: number;
  }) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    sessionStorage.setItem('scrollTargetTicker', groupTicker);
    
    navigate(`/detail/${data.id}`, { state: {groupTicker, articles} });
  };

  const isRead = !!data.is_read;

  return (
    <div
      onClick={handleCardClick}
      className={`overflow-hidden flex gap-3 w-full min-h-26 p-4  bg-white border border-gray-200 rounded-[14px]
        ${isRead ? 'opacity-40 grayscale-20' : 'opacity-100'}
    `}>
      <div className="flex flex-col justify-between grow">
        <p className="text-base font-medium text-gray-900">{data.headlineKo}</p>
        <div className="flex gap-1 items-center mt-1">          
          <p className="text-xs text-gray-500">{getTimeAgo(data.publishedAt)}</p>          
          <p className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
            data.sentimentLabel === 'positive' ? 'bg-emerald-50 text-emerald-600' :
            data.sentimentLabel === 'negative' ? 'bg-rose-50 text-rose-600' :
            data.sentimentLabel === 'mixed' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            {Math.floor(data.sentimentScore * 100)}
          </p>
        </div>
      </div>      
      <div className='overflow-hidden shrink-0 w-16 h-16 rounded-[10px] bg-gray-100'>
        <img src={data.imageUrl || defaultThumb} alt="" className='w-full h-full object-cover'/>
      </div>
    </div>
  );
};