import { useNavigate } from "react-router-dom";
//이미지
import Arrow from '../../assets/ic_arrow_right.svg';
import Edit from '../../assets/ic_edit.svg';
import Like from '../../assets/ic_like.svg';
import Settings from '../../assets/ic_settings.svg';
import Help from '../../assets/ic_help.svg';

export const MenuItem = () => {
  
  const navigate = useNavigate();

  const MENU_ITEMS = [
  { path: "/profileEdit", title: "내정보 수정", sub: "프로필 및 비밀번호 변경", img: Edit},
  { path: "/like", title: "관심 종목 관리", sub: "보고 싶은 종목을 설정하세요", img: Like},
  { path: "/settings", title: "설정", sub: "알림 및 앱 설정", img: Settings },
  { path: "/my", title: "도움말", sub: "자주 묻는 질문", img: Help},
];



  return (
    <>
    {MENU_ITEMS.map(({ path, title, sub, img }) => (
      <div 
        key={path}
        className="flex items-center justify-between h-20 px-4 border border-gray-200 rounded-2xl bg-white cursor-pointer"
        onClick={() => navigate(path)}
      >
        <div className="flex items-center gap-4">
          <img src={img} alt={title} />
          <div className="flex flex-col">
            <p className="text-base font-medium text-gray-900">{title}</p>
            <span className="text-sm text-gray-500">{sub}</span>
          </div>
        </div>
        <img src={Arrow} alt="" />
      </div>
    ))}
    </>
  );
};