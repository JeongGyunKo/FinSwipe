// 초기화 및 기본 설정
import ReactGA from "react-ga4";

let isInitialized = false;

export const initGA = () => {
  const GA_ID = import.meta.env.VITE_GA_ID;

  if (!GA_ID) return;

  if (!isInitialized) {
    ReactGA.initialize(GA_ID);
    isInitialized = true;

    if (import.meta.env.DEV) {
      console.log("✅ GA4 초기화 완료 (Development)");
    }
  }
};