import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { getWebPushToken } from '../lib/firebase';
//컴포넌트
import { Header } from "../components/layout/Header";
import { DialMenu } from "../components/layout/DialMenu";
import { NoticeBox } from "../components/common/NoticeBox";
//이미지
import bellAllOff from "../assets/ic_bell_all_off.svg";
import bellOff from "../assets/ic_bell_off.svg";
import bellOnBlue from "../assets/ic_bell_on_blue.svg";
import bellOnGreen from "../assets/ic_bell_on_green.svg";

export const Settings = () => {
  const [allAlarm, setAllAlarm] = useState(false);
  const [sentimentAlarm, setSentimentAlarm] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 설정 불러오기
  const fetchSettings = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const response = await fetch(`${API_BASE_URL}/news/notification-settings`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    setAllAlarm(data.notify_all_news);
    setSentimentAlarm(data.notify_sentiment_news);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 설정 업데이트
  const updateSettingsDB = async (isAll: boolean, isSentiment: boolean) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const response = await fetch(`${API_BASE_URL}/news/notification-settings`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notify_all_news: isAll,
        notify_sentiment_news: isSentiment,
      }),
    });

    if (!response.ok) {
      alert("설정 저장에 실패했습니다.");
      return false;
    }
    return true;
  };

  // 토큰 등록
  const requestAndSaveToken = async (isAll: boolean, isSentiment: boolean) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    // 🌐 웹 브라우저
    if (!Capacitor.isNativePlatform()) {
      try {
        const webToken = await getWebPushToken();
        if (webToken) {
          await fetch(`${API_BASE_URL}/news/device-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token: webToken, platform: "web" }),
          });
          return await updateSettingsDB(isAll, isSentiment);
        } else {
          alert("웹 브라우저 알림 권한을 허용해주세요!");
          return false;
        }
      } catch (error) {
        console.error("웹 설정 에러:", error);
        return false;
      }
    }

    // 📱 네이티브(앱)
    try {
      const permission = await FirebaseMessaging.requestPermissions();
      if (permission.receive === 'granted') {
        const { token } = await FirebaseMessaging.getToken();
        await fetch(`${API_BASE_URL}/news/device-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token, platform: "android" }),
        });
        return await updateSettingsDB(isAll, isSentiment);
      } else {
        alert("휴대폰 설정에서 알림 권한을 허용해 주세요!");
        return false;
      }
    } catch (error) {
      console.error("앱 토큰 발급 실패:", error);
      return false;
    }
  };

  // '모든 알림 받기' 토글 핸들러
  const handleAllAlarmToggle = async () => {
    const newAllAlarm = !allAlarm;
    
    if (newAllAlarm) {
      // 켜는 경우: 권한 확인 후 토큰 전송 (둘 다 true)
      const success = await requestAndSaveToken(true, true);
      if (success) {
        setAllAlarm(true);
        setSentimentAlarm(true);
      }
    } else {
      // 끄는 경우: 권한 확인할 필요 없이 DB만 false로 변경
      await updateSettingsDB(false, false);
      setAllAlarm(false);
      setSentimentAlarm(false);
    }
  };

  // '감성분석 알림만 받기' 토글 핸들러
  const handleSentimentAlarmToggle = async () => {
    const newSentimentAlarm = !sentimentAlarm;

    if (newSentimentAlarm) {
      // 감성 알림만 켜는 경우: 권한 확인 후 토큰 전송 (all: false, sentiment: true)
      const success = await requestAndSaveToken(false, true);
      if (success) {
        setSentimentAlarm(true);
        setAllAlarm(false);
      }
    } else {
      // 끄는 경우: DB만 false로 변경
      await updateSettingsDB(false, false);
      setSentimentAlarm(false);
      setAllAlarm(false);
    }
  };  

  const noticeBox = [
    "본 서비스에서 제공하는 정보는 투자 참고용이며, 수익성을 보장하지 않습니다. 모든 투자 결정은 본인의 책임 하에 이루어져야 하며, 투자로 인한 손실에 대해 당사는 책임지지 않습니다.",
  ];

  return (
    <>
    <Header type="sub" title="알림 및 설정" />
    <div className="px-4 py-6 pb-32 space-y-6">
      {/* 알림 설정 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-900">알림 설정</h3>
        <ul className="border border-gray-200 rounded-2xl">
          <li className="flex items-center justify-between h-24 px-4 border-b border-gray-200">
            <div className="flex gap-4 items-center">
              <img src={allAlarm ? bellOnBlue : bellAllOff} alt="" />
              <div>
                <p className="text-base text-gray-900">모든 알림 받기</p>
                <span className="text-sm text-gray-500">앱의 모든 알림을 받습니다</span>
              </div>
            </div>
            <button 
              onClick={handleAllAlarmToggle}
              className={`w-8 h-4.5 rounded-full transition-colors ${allAlarm ? "bg-gray-950" : "bg-neutral-300"}`}
            >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform m-px ${allAlarm ? "translate-x-3.5" : "translate-x-0"}`} />
            </button>
          </li>
          <li className="flex items-center justify-between h-24 px-4">
            <div className="flex gap-4 items-center">
              <img src={sentimentAlarm ? bellOnGreen : bellOff} alt="" />
              <div>
                <p className="text-base text-gray-900">감성분석 알림만 받기</p>
                <span className="text-sm text-gray-500">Positive/Negative 뉴스만 알림</span>
              </div>
            </div>
            <button 
              onClick={handleSentimentAlarmToggle}
              className={`w-8 h-4.5 rounded-full transition-colors ${sentimentAlarm ? "bg-gray-950" : "bg-neutral-300"}`}
            >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform m-px ${sentimentAlarm ? "translate-x-3.5" : "translate-x-0"}`} />
            </button>
          </li>
        </ul>
        <div className="p-4 text-sm text-blue-800 border border-blue-200 rounded-[14px] leading-relaxed bg-blue-50">
          💡 <b>감성분석 알림</b>은 시장에 큰 영향을 미칠 수 있는 긍정적(Positive) 또는 부정적(Negative) 뉴스만 선별하여 알림을 보냅니다. 중립적(Neutral) 뉴스는 제외됩니다.
        </div>
      </div>
      
      {/* 앱 정보 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-900">앱 정보</h3>
        <ul className="border border-gray-200 rounded-2xl">
          <li className="flex items-center justify-between h-18 px-4 border-b border-gray-200">
            <p className="text-base text-gray-700">버전</p>
            <p className="text-base text-gray-500">v1.0.0</p>
          </li>
          <li className="flex items-center justify-between h-18 px-4">
            <p className="text-base text-gray-700">최근 업데이트</p>
            <p className="text-base text-gray-500">2026.05.12</p>
          </li>
        </ul>
      </div>

      {/* 약관 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-900">약관 및 정책</h3>
        <ul className="border border-gray-200 rounded-2xl">
          <li className="border-b border-gray-200">
            <Link to="/terms" className="flex items-center justify-between h-18 px-4">
              <p className="text-base text-gray-700">이용약관</p>
              <span className="text-gray-400">›</span>
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="flex items-center justify-between h-18 px-4">
              <p className="text-base text-gray-700">개인정보처리방침</p>
              <span className="text-gray-400">›</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 투자 유의사항 */}
        <NoticeBox contents={noticeBox} />
    </div>
    <DialMenu />
    </>
  );
};