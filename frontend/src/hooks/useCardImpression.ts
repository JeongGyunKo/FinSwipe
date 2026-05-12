import { useEffect, useRef } from "react";
import { trackEvent } from "../lib/analytics/events";
import type { GAEventParams } from "../lib/analytics/types";


type CardData = GAEventParams["card_viewed"];

export const useCardImpression = (data: CardData) => {
  const domRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFired = useRef(false); // 중복 발화 방지 (명세서 4.4 규칙)

  useEffect(() => {
    // 이미 이 카드를 트래킹했다면 감시하지 않음
    if (hasFired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 1. 50% 이상 노출 시작 (threshold: 0.5)
            // 2. 1초(1000ms) 타이머 가동
            timerRef.current = setTimeout(() => {
              trackEvent("card_viewed", data);
              hasFired.current = true; // 중복 방지 플래그 On
              observer.unobserve(entry.target); // 더 이상 감시할 필요 없음
            }, 1000);
          } else {
            // 사용자가 1초가 되기 전에 화면을 벗어나면 타이머 취소
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
          }
        });
      },
      { threshold: 0.5 } // 카드 면적의 50%가 보일 때 작동
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      observer.disconnect();
    };
  }, [data]);

  return domRef;
};