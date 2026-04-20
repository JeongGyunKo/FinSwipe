import type { NewsCardData } from '../types/news';

export const MOCK_DATA: NewsCardData[] = [
  {
    id: "uuid-1",
    headline: "NVIDIA AI 칩 수요 폭증, 데이터센터 매출 200% 증가",
    summary: "엔비디아의 최신 AI 칩 수요가 전 세계적으로 폭주하며 데이터센터 부문 매출이 전년 대비 200% 이상 성장했습니다. 분석가들은 목표 주가를 상향 조정하고 있습니다.",
    summary_3lines: [
      "NVIDIA AI 칩 수요 전례 없는 수준으로 폭증",
      "데이터센터 매출 전년 대비 200% 이상 성장 기록",
      "주요 투자은행들, 엔비디아 목표주가 일제히 상향"
    ],
    source_url: "https://finance.yahoo.com/news/nvidia-growth",
    tickers: ["NVDA"],
    sentiment_label: "Positive",
    sentiment_score: 0.95,
    published_at: new Date().toISOString(),
    categories: ["Technology", "Stock"]
  },
  {
    id: "uuid-2",
    headline: "팔란티어, 미 정부와 대규모 신규 계약 체결 성공",
    summary: "팔란티어가 미국 정부와 새로운 데이터 플랫폼 공급 계약을 체결했습니다. 이번 계약으로 수익성 개선이 더욱 뚜렷해질 전망입니다.",
    summary_3lines: [
      "팔란티어, 미 정부와 대규모 신규 플랫폼 계약 체결",
      "정부향 매출 비중 확대로 안정적 수익 구조 확보",
      "분기 실적 발표 앞두고 시장 기대감 고조"
    ],
    source_url: "https://www.bloomberg.com/news/palantir-contract",
    tickers: ["PLTR"],
    sentiment_label: "Positive",
    sentiment_score: 0.88,
    published_at: new Date().toISOString(),
    categories: ["Software", "Contract"]
  },
  {
    id: "uuid-3",
    headline: "시장 전반의 흐름: 인플레이션 둔화 신호 포착",
    summary: "최근 발표된 경제 지표에 따르면 인플레이션이 둔화되는 신호가 보이고 있습니다. 시장은 연준의 다음 행보에 주목하고 있습니다.",
    summary_3lines: [
      "소비자 물가 지수 예상보다 낮게 발표되며 안정세",
      "시장 참여자들, 금리 인하 가능성에 베팅 확대",
      "고용 지표는 여전히 탄탄한 모습 유지 중"
    ],
    source_url: "https://www.reuters.com/markets/economy",
    tickers: [], // ❗ DB에 NULL이 들어올 때를 대비한 테스트용 (NULL으로 분류될 것)
    sentiment_label: "Neutral",
    sentiment_score: 0.5,
    published_at: new Date().toISOString(),
    categories: ["Macro", "Economy"]
  }
];