import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabase';
//컴포넌트
import { Navigation } from "../components/layout/Navigation"
import { MenuItem } from "../components/my/MenuItem"
import { NoticeBox } from "../components/common/NoticeBox"
//이미지
import Profile from "../assets/ic_profile.svg";
import Logout from "../assets/ic_logout.svg";

export const My = () => {
  const navigate = useNavigate();  
  const [userEmail, setUserEmail] = useState("");

  //유저 정보 가져오기
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user.email ?? "");
    };
    getUser();
  }, []);

  //로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  //투자경고 텍스트 박스
  const noticeBox = [
    "본 서비스에서 제공하는 정보는 투자 참고용이며, 수익성을 보장하지 않습니다. 모든 투자 결정은 본인의 책임 하에 이루어져야 하며, 투자로 인한 손실에 대해 당사는 책임지지 않습니다.",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 제목, 검색 */}
      <div className="flex flex-col gap-1 p-4 pt-8 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        <p className="text-sm text-gray-500">설정 및 정보를 관리하세요</p>
      </div>

      {/* 프로필 */}
      <div className="flex items-center gap-4 border-t border-t-gray-100 px-4 py-6 bg-white">
        <img src={Profile} alt="" />
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium text-gray-900">{userEmail}</p>
          <button onClick={handleLogout} className="w-fit flex items-center gap-2 h-7 px-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">
            <img src={Logout} alt="" />
            로그아웃
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4">
        {/* 메뉴 */}
        <div className="space-y-2 mb-8">
          <MenuItem />
        </div>
        <NoticeBox contents={noticeBox}/>
        <p className="mt-4 text-center text-xs text-gray-400">v1.0.0 • © 2026 Finswipe</p>
      </div>
      
      <Navigation showDisclaimer={false}/>
    </div>
  );
};