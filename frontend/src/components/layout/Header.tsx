import { useNavigate } from "react-router-dom";
//이미지
import logo from '../../assets/logo.svg';
import logoTxt from '../../assets/logo_tx_black.svg';
import share from '../../assets/ic_share.svg';
import back from '../../assets/ic_back.svg';

interface HeaderProps {
  type: 'main' | 'detail' | 'sub' | 'none';
  title?: string;
}

export const Header = ({ type, title }: HeaderProps) => {
  const navigate = useNavigate();

  // 시스템 공유 함수
  const handleShare = async () => {
    const shareData = {
      title: title || 'FinSwipe',
      text: '핀스와이프에서 흥미로운 뉴스를 확인해보세요!',
      url: window.location.href, // 현재 보고 있는 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('공유 실패 또는 취소:', error);
      }
    } else {
      // 데스크탑 브라우저 등 미지원 시 클립보드 복사로 대체
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
      } catch (err) {
        console.error("복사 실패:", err);
        alert('공유하기를 지원하지 않는 브라우저입니다.');
      }
    }
  };

  //헤더 없는 페이지 처리
  if (type === 'none') return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-18 px-4 border-b border-gray-100 bg-white">
      {/* 메인 */}
      {(type === 'main') && (
        <h1 className="flex items-center">
          <img src={logo} alt="로고" />
          <img src={logoTxt} alt="FinSwipe" />
        </h1>
      )}
      {(type === 'detail' || type === 'sub') && (
        <div className="flex items-center gap-4">
          <button onClick={() => type === 'detail' ? navigate('/') : navigate(-1)} className="w-10 h-10 cursor-pointer">
            <img src={back} alt="뒤로가기" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>        
        </div>
      )}
      {(type === 'detail') && (
        <button 
          onClick={handleShare}
          className="w-10 h-10 cursor-pointer"
        >
          <img src={share} alt="공유하기" />
        </button>
      )}      
    </header>
  )
};