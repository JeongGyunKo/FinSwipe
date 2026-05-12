# 📰 FinSwipe (핀스와이프)
> **AI가 분석한 미국 주식 뉴스를 한국어로 스와이프하는 금융 투자 앱**  
> 수많은 영문 금융 뉴스를 종목(Ticker)별로 자동 분류하고, AI가 감성·요약·근거를 한국어로 제공합니다.

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=Supabase&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=GoogleGemini&logoColor=white">
</p>

---

## ✨ 핵심 기능 (Key Features)

- **📡 뉴스 자동 수집**: 15분마다 Finlight API로 7개 쿼리 × 최대 100개 영문 뉴스 수집
- **🧠 AI 감성 분석**: FinBERT 기반 Positive / Negative / Neutral / Mixed 분류
- **💡 XAI 하이라이팅**: LIME 기반 감성 판단 근거 문장 추출 및 한국어 번역
- **📝 3줄 요약**: Gemini가 전문을 읽고 핵심 3줄 한국어 요약 생성
- **📱 스와이프 피드**: 읽은 기사는 뒤로, 안 읽은 기사만 피드 제공
- **🔔 실시간 알림**: FCM 기반 관심 종목 뉴스 즉시 푸시 알림
- **🌐 PWA + 네이티브**: Capacitor로 Web · iOS · Android 동시 지원

---

## 🏗 아키텍처 (Architecture)

```
Finlight API
     ↓ (15분마다)
Spring Boot BE ──저장──→ Supabase (PostgreSQL)
     ↓ (분석 요청)
GenAI Server (Worker × 2)
  ├── FinBERT  : 감성 분석
  ├── LIME     : XAI 하이라이트 추출
  └── Gemini   : 3줄 요약 + 전체 한국어 번역
     ↓ (완료 즉시 저장)
Supabase DB ──→ Spring Boot API ──→ Frontend (React)
                                          ↓
                                   FCM 푸시 알림
```

---

## 📁 프로젝트 구조 (Monorepo)

```
FinSwipe/
 ├── 📂 frontend/         # React 19 + TypeScript 앱 (Web / iOS / Android)
 ├── 📂 backend-spring/   # Spring Boot 4 서버 (현재 운영)
 ├── 📂 backend/          # FastAPI 서버 (구버전)
 └── 📂 gen-ai/           # AI 분석 서버 (감성 · 요약 · XAI · 번역)
```

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 19 · TypeScript · Vite
- **스타일**: Tailwind CSS · Framer Motion
- **상태관리**: TanStack React Query · Zustand
- **알림**: Firebase Cloud Messaging (FCM)
- **인증/DB**: Supabase
- **분석**: Google Analytics 4 (GA4)
- **크로스플랫폼**: Capacitor (iOS · Android)
- **배포**: Vercel

### Backend (Spring Boot · 현재 운영)
- **Framework**: Spring Boot 4.0.5 · Java 21 (Virtual Threads)
- **DB**: Supabase PostgreSQL · Flyway 마이그레이션
- **캐시**: Caffeine (뉴스 30초 · 티커 1시간)
- **보안**: Bucket4j Rate Limiting · IP 스푸핑 방지 · CORS 제한
- **알림**: FCM HTTP v1 API (OAuth 2.0 JWT 직접 구현)
- **배포**: Zeabur · Docker

### Backend (FastAPI · 구버전)
- **Framework**: FastAPI · Python
- **스케줄러**: APScheduler
- **배포**: Zeabur

### Gen AI
- **Framework**: FastAPI · Python 3.11
- **감성 분석**: FinBERT (로컬 모델)
- **XAI**: LIME
- **요약 · 번역**: Gemini 2.5 Flash Lite
- **큐**: PostgreSQL 기반 Job Queue (Worker × 2)
- **배포**: Zeabur · Docker

### Database & Infra
- **DB**: Supabase (PostgreSQL 17.6)
- **보안**: RLS 정책 · service_role 전용 테이블 접근 제어
- **뉴스 수집**: Finlight API
- **마이그레이션**: Flyway V1 ~ V11

---

## 🔒 보안 (Security)

- 모든 API Key · 비밀번호 환경변수 관리 (`.env` git 제외)
- HTTPS: Vercel + Zeabur 자동 SSL
- Supabase RLS: 테이블별 접근 정책 · anon/authenticated 차단
- Rate Limiting: IP별 분당 30회 (admin 300회)
- IP 스푸핑 방어: `X-Real-IP` 우선 사용

---

## 👥 팀 (Team)

| 역할 | 담당 |
|------|------|
| Backend (Spring Boot) | 고정균 |
| Frontend | 민기낭 |
| Gen AI | 김한별 |
| Management | 정종호 |
