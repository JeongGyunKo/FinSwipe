// 동의·초기화 체크
import ReactGA from "react-ga4";
import { sanitizeParams } from "./sanitize";
import type { GAEventParams } from "./types";

const hasAnalyticsConsent = () => {
  const consent = localStorage.getItem("analytics_consent");
  return consent === null || consent === "true"; 
};

export const trackEvent = <K extends keyof GAEventParams>(
  eventName: K,
  params?: GAEventParams[K]) => {
  if (!hasAnalyticsConsent()) return;

  const sanitizedParams = sanitizeParams({
    ...params,
    timestamp_client: Date.now(), // 모든 이벤트 공통 정보
  });

  ReactGA.event(eventName, sanitizedParams);

  if (import.meta.env.DEV) {
    console.log(`📊 [GA4 Event]: ${eventName}`, sanitizedParams);
  }
};