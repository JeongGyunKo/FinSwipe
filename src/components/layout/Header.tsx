import { useNavigate } from "react-router-dom";
//이미지
import logo from '../../assets/logo.svg';
import logoTxt from '../../assets/logo_tx_black.svg';
import share from '../../assets/ic_share.svg';
import back from '../../assets/ic_back.svg';
import mark from '../../assets/ic_mark.svg';
//import markOn from '../../assets/ic_mark_on.svg';

interface HeaderProps {
  type: 'main' | 'detail' | 'sub' | 'none';
  title?: string;
}

export const Header = ({ type, title }: HeaderProps) => {
  const navigate = useNavigate();

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
          <button onClick={() => navigate(-1)} className="w-10 h-10 cursor-pointer">
            <img src={back} alt="뒤로가기" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>        
        </div>
      )}
      {(type === 'detail') && (
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 cursor-pointer">
            <img src={mark} alt="뒤로가기" />
          </button>
          <button className="w-10 h-10 cursor-pointer">
            <img src={share} alt="공유하기" />
          </button>
        </div>
      )}      
    </header>
  )
};