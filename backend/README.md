# 🐍 FinSwipe Backend (FastAPI · 구버전)
> **FastAPI 기반 뉴스 수집 · API 서버**  
> 현재 운영 버전은 `backend-spring/` 으로 대체되었습니다.

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=Supabase&logoColor=white">
</p>

---

## ✨ 핵심 기능 (Key Features)

- **📡 뉴스 자동 수집**: 15분마다 Finlight API 7쿼리 × 최대 100개 영문 뉴스 수집
- **🎯 티커 필터링**: NYSE · NASDAQ · AMEX 전체 보통주 5,531개 종목 지원
- **🔄 자동 재분석**: 30분마다 미분석 기사 자동 재처리
- **🧹 정기 정리**: 6시간마다 content / ticker 없는 기사 정리

---

## 🛠 기술 스택 (Tech Stack)

### Core
- **Framework**: FastAPI
- **Language**: Python
- **DB**: Supabase (PostgreSQL)
- **스케줄러**: APScheduler

### Infrastructure
- **뉴스 수집**: Finlight API
- **배포**: Zeabur

---

## 📐 파이프라인 (Pipeline)

```
15분마다  Finlight API (7쿼리 × 100개)
          → URL 중복 제거
          → Supabase 저장
          → GenAI 서버 분석 요청

30분마다  미분석 기사 재분석

6시간마다 content · ticker 없는 기사 정리
```

---

## 🚀 로컬 실행

```bash
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## ⚙️ 환경변수 (Environment Variables)

| 변수 | 설명 |
|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role 키 |
| `FINLIGHT_API_KEY` | Finlight API 키 |
| `GENAI_URL` | GenAI 서버 URL |
| `GENAI_USER` | GenAI 인증 유저 |
| `GENAI_PASSWORD` | GenAI 인증 패스워드 |
| `ADMIN_API_KEY` | 관리용 API 키 (16자 이상) |