import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../../types/chat";
//이미지
import logo from '../../assets/logo.svg';
import logoTxt from '../../assets/logo_tx_black.svg';
import share from '../../assets/ic_share.svg';
import back from '../../assets/ic_back.svg';
import chatbot from '../../assets/ic_chatbot.svg';

interface HeaderProps {
  type: 'main' | 'detail' | 'sub' | 'none';
  title?: string;
}

export const Header = ({ type, title }: HeaderProps) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // 알림 갯수
  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
  }, []);

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
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-15 px-4 bg-white">
      {/* 메인 */}
      {(type === 'main') && (
        <h1 className="flex items-center">
          <img src={logo} alt="로고" className="h-10"/>
          <img src={logoTxt} alt="FinSwipe" className="h-6.5"/>
        </h1>      
      )}
      {(type === 'detail' || type === 'sub') && (
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (type === 'detail') {
              window.dispatchEvent(new Event('homeRefresh'));
              navigate('/');
            } else {
              navigate(-1);
            }
          }} className="w-10 h-10 cursor-pointer">
            <img src={back} alt="뒤로가기" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>        
        </div>
      )}      
      {/* 챗봇 아이콘 - 로그인 시에만 표시 */}
      {isLoggedIn && (
        <div className="flex items-center relative" onClick={() => navigate(`/chat`)}>
          {(type === 'detail') && (
            <button 
              onClick={handleShare}
              className="w-10 h-10 cursor-pointer"
            >
              <img src={share} alt="공유하기" />
            </button>
          )}
          <button><img src={chatbot} alt="챗봇가기" className="w-13" /></button>
          {unreadCount > 0 && (
            <p className="absolute top-1 right-0 px-1 min-w-4 h-4 flex justify-center items-center rounded-full bg-red-500">
              <span className="text-[9px] font-black text-white">{unreadCount}</span>
            </p>
          )}
        </div>
      )}
    </header>
  )
};