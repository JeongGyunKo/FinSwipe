import type { NewsCardData } from '../../types/news';
import cardImg from '../../assets/card_img.jpg';
import clock from '../../assets/ic_clock.svg';

interface Props {
  data: NewsCardData;
  onClick?: () => void;
}

export const SwipeCard = ({ data, onClick }: Props) => {
  return (
    <div className='overflow-hidden relative w-[90%] max-w-87.5 items-start bg-white rounded-3xl border border-solid border-gray-200'>
      {/* 이미지 */}
      <div className='overflow-hidden h-40'><img src={cardImg} alt="" className='w-full aspect-344/160 object-cover'/></div>

      {/* 상단 티커 정보 */}
      <div className='before-empty absolute top-0 left-0 w-full p-3 flex justify-between items-center'>
        <span className='h-5 px-2.5 rounded-full bg-white/90 leading-5 text-xs font-semibold text-[#101828]'>{data.ticker}</span>
        <span className='flex gap-1 text-white/90 text-xs'>
          <img src={clock} alt="" />
          {data.publishedAt}
        </span>
      </div>

      {/* 중앙 텍스트 내용 */}
      <div className='flex flex-col gap-2 p-4'>
        <div className="flex items-center gap-2">
          <span className='px-2 h-5 rounded-sm text-sm font-medium text-[#0064FF] bg-[#0064FF1A]'>기술</span>
          <span className='text-sm text-[#6A7282]'>{data.sentimentTag}</span>
        </div>
        <div className='text-[#101828] text-4 font-bold'>NVIDIA AI 칩 수요 폭증, 주가 신고점 경신</div>
        <div className="text-sm text-[#4A5565]">{data.summary}</div>
      </div>

      {/* 하단 출처 자세히보기 */}
      <div className='flex justify-between items-center p-4 border-t border-solid border-[#E5E7EB]'>
        <div className="text-xs text-gray-500">Bloomberg</div> 
        <div onClick={onClick} className='px-3 py-1.5 text-xs text-blue-600 font-semibold cursor-pointer'>자세히 보기 →</div>
      </div>
    </div>
  );
};