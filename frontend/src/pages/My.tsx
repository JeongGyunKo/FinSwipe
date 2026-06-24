import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//컴포넌트
import { DialMenu } from "../components/layout/DialMenu"
import { MenuItem } from "../components/my/MenuItem"
import { NoticeBox } from "../components/common/NoticeBox"
//이미지
import Profile from "../assets/ic_profile.svg";

export const My = () => {
  const navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [tendency, setTendency] = useState("");
  const [level, setLevel] = useState("");
  
  
  //유저 정보 가져오기
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('accessToken');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("프로필 정보를 불러올 수 없습니다.");

      const data = await response.json();      
      
      setEmail(data.email);
      setTendency(data.tendency);
      setLevel(data.level);

      // 로컬 스토리지도 최신 정보로 갱신
      if (data.email) {
        setEmail(data.email);
        localStorage.setItem('email', data.email);
      }
      if (data.display_name) localStorage.setItem('displayName', data.display_name);
      
    } catch (error) {
      console.error("프로필 로드 에러:", error);
    }
  };

  // useEffect에서 호출
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail && savedEmail !== 'undefined') {
      setEmail(savedEmail);
    }

    fetchUserProfile();
  }, []);

  //로그아웃
  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');

    window.dispatchEvent(new Event('logout'));
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
          {tendency && (
            <p className="text-lg font-bold text-gray-900">{tendency} Lv.{level}</p>
          )}
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4">
        {/* 메뉴 */}
        <div className="space-y-2">
          <MenuItem />
        </div>
        <div className="text-center py-8">
          <button onClick={handleLogout} className="text-sm text-gray-500 underline">로그아웃</button>
        </div>
        <NoticeBox contents={noticeBox}/>
        <p className="mt-4 text-center text-xs text-gray-400">v1.0.0 • © 2026 Finswipe</p>
      </div>
      
      <DialMenu/>
    </div>
  );
};