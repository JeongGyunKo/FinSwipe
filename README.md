# FinSwipe

미국 주식 관련 영문 뉴스를 자동 수집하고 AI 감성분석을 제공하는 주식 투자 앱

## 프로젝트 구조

`````````n FinSwipe/
 ├── backend/   # FastAPI 기반 뉴스 수집 및 API 서버
 ├── frontend/  # React + TypeScript 기반 클라이언트
 └── gen-ai/    # AI 감성분석 서버
`````````n
## 기술 스택

| 파트 | 기술 |
|------|------|
| Backend | FastAPI · Supabase · Finlight · APScheduler · Zeabur |
| Frontend | React · TypeScript · Vite · Tailwind CSS |
| Gen AI | AI 감성분석 서버 |

## 주요 기능

- NYSE · NASDAQ · AMEX 전체 보통주 5,531개 종목 지원
- 15분마다 Finlight API로 영문 뉴스 자동 수집
- AI 기반 뉴스 감성분석 (긍정 / 중립 / 부정)
- 한국어 종목명 474개 지원

## 팀원

| 역할 | 담당 |
|------|------|
| Backend | 고정균 |
| Frontend | 민기낭 |
| Gen AI | 김한별 |
| Management | 정종호 |
