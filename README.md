# 📰 FinSwipe (핀스와이프)
> **AI가 분석한 미국 주식 뉴스를 한국어로 스와이프하는 금융 투자 앱**  
> 수많은 영문 금융 뉴스를 종목(Ticker)별로 자동 분류하고, AI가 감성·요약·근거를 한국어로 제공합니다.

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white">
  <img src="https://img.shields.io/badge/Java_21-007396?style=for-the-badge&logo=OpenJDK&logoColor=white">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=GoogleGemini&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black">
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white">
</p>

<p align="center">
  🌐 <a href="https://www.finswipe.co.kr">서비스 바로가기</a> · 🔌 <a href="https://api.finswipe.co.kr/health">API 헬스체크</a>
</p>

---

## ✨ 핵심 기능 (Key Features)

- **📡 뉴스 자동 수집**: 15분마다 Finlight API로 영문 뉴스 수집 (NASDAQ·NYSE 거래소 필터, 상장 종목만)
- **🧠 AI 감성 분석**: FinBERT 기반 Positive / Negative / Neutral / Mixed 분류 + 감성 점수(-100 ~ +100)
- **💡 XAI 하이라이팅**: FinBERT 어텐션 기반 감성 판단 근거 문장 추출 및 한국어 번역
- **📝 3줄 요약 & 인사이트**: Gemini가 전문을 읽고 핵심 3줄 한국어 요약 + RSI 등 지표 인사이트 생성
- **📱 스와이프 피드**: 틴더형 카드 덱, 읽은 기사 제외, 감성 테마 4종(bull·bear·neutral·mixed) 카드 디자인
- **🤖 AI 챗봇**: 관심종목·뉴스 기반 대화, DB 기분석 토큰 0 응답, 프롬프트 인젝션 방어, 미읽음 뱃지
- **🧩 투자성향 퀴즈**: 세션형 퀴즈 + 영역별 채점으로 5가지 투자 성향 도출 (레이더 차트)
- **🎯 개인화 콘텐츠**: 5단계 레벨 × 5가지 투자 성향 맞춤형 분석·다이제스트·코치·큐레이션
- **🗞 일일 다이제스트**: 카드 소진 후 관심종목 하루치 인사이트를 다이제스트 카드로 제공
- **🔄 상장/폐지 자동 동기화**: NASDAQ Trader SymDir 기반 상장 목록 추적, 폐지 시 관심종목 자동 제거
- **🔔 실시간 알림**: FCM 기반 관심 종목 뉴스 즉시 푸시 + 미읽음 알림 개수
- **🌐 PWA + 네이티브**: Capacitor로 Web · iOS · Android 동시 지원

---

## 🏗 아키텍처 (Architecture)

```
Finlight API
     ↓ (15분마다 · 거래소 필터)
Spring Boot BE (AWS EC2 · Java 21)
     ├── 뉴스 수집·저장 ──→ Supabase (PostgreSQL)
     ├── GenAI 분석 요청 (RestClient 프록시)
     └── REST API + JWT 인증
              ↕
GenAI Server (FastAPI · Worker)
     ├── FinBERT   : 감성 분석 + 어텐션 XAI 근거 추출
     └── Gemini    : 3줄 요약 · 번역 · 개인화 · 챗봇 · 퀴즈 코치
              ↓ (완료 즉시 저장)
Supabase DB ──→ Spring Boot API ──→ Frontend (React · Vercel)
   Nginx(HTTPS) ┘                       ├── 스와이프 피드 / 챗봇 / 퀴즈
                                        └── FCM 푸시 알림
```

---

## 📁 프로젝트 구조 (Monorepo)

```
FinSwipe/
 ├── 📂 frontend/         # React 19 + TypeScript 앱 (Web / iOS / Android)
 ├── 📂 backend-spring/   # Spring Boot 4 서버 (현재 운영)
 ├── 📂 backend/          # FastAPI 서버 (구버전)
 └── 📂 gen-ai/           # AI 분석 서버 (감성 · 요약 · XAI · 번역 · 챗봇 · 퀴즈)
```

> 통합 레포는 세 개의 소스 레포(FE / BE / GenAI)를 주기적으로 동기화하는 배포용 미러입니다. 자세한 내용은 [브랜치 전략](#-브랜치-전략-branch-strategy)을 참고하세요.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 19 · TypeScript · Vite
- **스타일**: Tailwind CSS · Framer Motion
- **상태관리**: TanStack React Query · Zustand
- **인증**: AWS API + JWT _(구 Supabase에서 마이그레이션 완료)_
- **알림**: Firebase Cloud Messaging (FCM)
- **차트**: Recharts (투자성향 레이더 차트)
- **분석**: Google Analytics 4 (GA4)
- **크로스플랫폼**: Capacitor (iOS · Android)
- **배포**: Vercel — https://www.finswipe.co.kr

### Backend (Spring Boot · 현재 운영)
- **Framework**: Spring Boot 4.0.5 · Java 21 (Virtual Threads)
- **DB**: Supabase PostgreSQL · Flyway 마이그레이션 (V1 ~ V33)
- **캐시**: Caffeine (뉴스 30초 · 티커 1시간)
- **보안**: JWT 인증 · Bucket4j Rate Limiting · IP 스푸핑 방지 · CORS 제한 · Swagger Basic 인증 게이트
- **AI 연동**: RestClient로 GenAI FastAPI 프록시 (개인화 · 다이제스트 · 코치 · 큐레이션 · 챗봇)
- **알림**: FCM HTTP v1 API (OAuth 2.0 JWT 직접 구현)
- **배포**: AWS EC2 (Ubuntu) · Nginx · systemd · GitHub Actions self-hosted runner (무중단 배포)

### Backend (FastAPI · 구버전)
- **Framework**: FastAPI · Python
- **스케줄러**: APScheduler

### Gen AI
- **Framework**: FastAPI · Python 3.11
- **감성 분석**: FinBERT (로컬 모델)
- **XAI**: FinBERT 어텐션 기반 (마지막 레이어 CLS 어텐션을 문장 단위로 집계 → 근거 문장 하이라이팅)
- **LLM**: Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite` — 요약 · 번역 · 개인화 · 챗봇 · 퀴즈 코치)
- **에이전트**: personalized / digest / coach / curation (LangGraph)
- **기술 지표**: yfinance RSI(14) · MACD(12/26/9) · 거래량 비율
- **큐**: PostgreSQL 기반 Job Queue (Worker)
- **배포**: AWS EC2 · systemd

### Database & Infra
- **DB**: Supabase (PostgreSQL 17)
- **보안**: RLS 정책 · service_role 전용 테이블 접근 제어
- **뉴스 수집**: Finlight API
- **마이그레이션**: Flyway V1 ~ V33
- **HTTPS**: Nginx + Certbot 자동 갱신 (api) · Vercel SSL (www)

---

## 🌿 브랜치 전략 (Branch Strategy)

| 레포 | 기본 브랜치 | 전략 |
|------|:----------:|------|
| **BE** ([FinSwipe_be_springboot](https://github.com/JeongGyunKo/FinSwipe_be_springboot)) | `master` | 기능·버그별 `feat/*` · `fix/*` 브랜치에서 작업 후 `master` 병합. `master` push 시 GitHub Actions가 EC2 무중단 자동 배포 |
| **FE** ([naangarchive/FinSwipe](https://github.com/naangarchive/FinSwipe)) | `main` | 트렁크 기반 — `main` 직접 커밋, Vercel 자동 배포 |
| **통합** ([JeongGyunKo/FinSwipe](https://github.com/JeongGyunKo/FinSwipe)) | `main` | 배포용 미러 — 각 소스 레포 최신 코드를 주기적으로 동기화(`auto-sync`) |

**커밋 컨벤션**: `feat:` · `fix:` · `refactor:` · `ci:` · `docs:` prefix + 한국어 본문  
**BE 브랜치 예시**: `feat/chat-cached-insight` · `fix/chat-prompt-injection` · `fix/news-latest-idor` · `fix/search-quote-normalize`

---

## 🔒 보안 (Security)

- **인증**: JWT 기반, 뉴스·챗봇 등 전 엔드포인트 인증 필수 (헬스체크만 공개)
- **비밀 관리**: 모든 API Key · 비밀번호 환경변수(`.env` git 제외) · GitHub Secrets 주입
- **HTTPS**: Nginx + Certbot 자동 갱신 (api) · Vercel SSL (www)
- **Rate Limiting**: 챗봇 GET 60회/분 · POST 20회/분 · 퀴즈 LLM 비용 가드레일 · IP별 분당 제한
- **프롬프트 인젝션 방어**: 챗봇 시스템 프롬프트 3겹 가드 (가이드라인 열거 차단 포함)
- **접근 제어**: IDOR 방지(userId 쿼리 신뢰 제거) · Broken Access Control 대응
- **Swagger**: Basic 인증 게이트(`ENABLE_SWAGGER` 환경변수, 상수시간 비교)
- **IP 스푸핑 방어**: `X-Real-IP` 우선 사용
- **Supabase RLS**: 테이블별 접근 정책 · anon/authenticated 차단

---

## 🔗 링크 (Links)

- **서비스**: https://www.finswipe.co.kr
- **API / 헬스체크**: https://api.finswipe.co.kr/health
- **Frontend 레포**: https://github.com/naangarchive/FinSwipe
- **Backend 레포**: https://github.com/JeongGyunKo/FinSwipe_be_springboot

---

## 👥 팀 (Team)

| 역할 | 담당 |
|------|------|
| Backend (Spring Boot) | 고정균 |
| Frontend | 민기낭 |
| Gen AI | 고정균 |
| Management | 정종호 |
