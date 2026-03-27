import type { BriefingResponse } from '../types/news';

export const MOCK_DATA: BriefingResponse = {
  "userId": "user-123",
  "cards": [
    {
      "briefingId": "b1", "newsId": "n1", "ticker": "NVDA",
      "summary": ["NVIDIA AI 칩 수요 폭증", "데이터센터 매출 200% 증가", "목표주가 상향 조정"],
      "sentimentTag": "POSITIVE", "publishedAt": "10분 전"
    },
    {
      "briefingId": "b2", "newsId": "n2", "ticker": "PLTR",
      "summary": ["팔란티어 신규 계약 체결", "정부용 플랫폼 수요 확대", "수익성 개선 뚜렷"],
      "sentimentTag": "POSITIVE", "publishedAt": "25분 전"
    },
    {
      "briefingId": "b3", "newsId": "n3", "ticker": "AAPL",
      "summary": ["애플 자체 AI 모델 발표", "온디바이스 AI 시장 주도", "아이폰 판매 둔화 극복"],
      "sentimentTag": "NEUTRAL", "publishedAt": "1시간 전"
    }
  ]
};