# ⚙️ FinSwipe Backend (Spring Boot)
> **뉴스 수집 · AI 분석 파이프라인 · REST API 서버**  
> Finlight에서 수집한 영문 뉴스를 GenAI 서버로 분석 요청하고, 완성된 한국어 기사만 사용자에게 제공합니다.

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white">
  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white">
  <img src="https://img.shields.io/badge/Flyway-CC0200?style=for-the-badge&logo=Flyway&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black">
</p>

---

## ✨ 핵심 기능 (Key Features)

- **📡 뉴스 자동 수집**: 15분마다 Finlight API 7쿼리 × 최대 100개, URL 중복 제거 후 DB 저장
- **⚡ 실시간 저장**: 기사 분석 완료 즉시 저장 — 전체 배치 완료를 기다리지 않음
- **🔍 한국어 완성 검증**: `headline_ko` · `summary_3lines_ko` · `xai_ko` 모두 한글 포함 시만 사용자 노출
- **🔄 자동 재시도**: 분석 실패한 기사는 1분 주기로 재시도 (생성 후 3시간 이내)
- **🔔 FCM 알림**: 관심 종목 관련 신규 기사 분석 완료 시 즉시 푸시 알림 발송
- **📖 읽음 기록**: 사용자별 읽은 기사 추적, 읽지 않은 기사만 피드 제공

---

## 🛠 기술 스택 (Tech Stack)

### Core
- **Framework**: Spring Boot 4.0.5
- **Language**: Java 21 (Virtual Threads 활용)
- **DB**: Supabase PostgreSQL · Spring Data JPA
- **마이그레이션**: Flyway (V1 ~ V11 자동 실행)

### 성능 · 안정성
- **캐시**: Caffeine (뉴스 목록 30초 · 티커 1시간 TTL, 최대 50,000 IP bucket)
- **Rate Limiting**: Bucket4j (public 30rpm · admin 300rpm)
- **동시성**: Semaphore 기반 GenAI 동시 요청 제어 (4개)

### 보안
- **IP 스푸핑 방어**: `X-Real-IP` 우선 사용
- **Admin Key**: timing-safe 비교 (`MessageDigest.isEqual`) · 실패 WARN 로그
- **CORS**: 명시적 허용 헤더만 (`Content-Type` · `Accept` · `X-Admin-Key`)
- **보안 헤더**: HSTS · X-Frame-Options · CSP · X-Content-Type-Options

### 알림
- **FCM HTTP v1 API**: OAuth 2.0 JWT 직접 구현 (google-auth 라이브러리 미사용)
- **토큰 캐싱**: 55분 캐시, 만료 5분 전 자동 갱신
- **만료 토큰 정리**: 404/400 응답 시 `device_tokens`에서 자동 삭제

---

## 📐 프로젝트 구조 (Project Structure)

```bash
src/main/java/com/finswipe/
 ┣ 📂 config/         # AppProperties · CorsConfig · AsyncConfig · FlywayConfig
 ┣ 📂 controller/     # NewsController · AuthController · HealthController
 ┣ 📂 domain/         # NewsArticle Entity · Repository
 ┣ 📂 dto/            # Request · Response DTO
 ┣ 📂 filter/         # RateLimitFilter · SecurityHeadersFilter
 ┣ 📂 job/            # JobTrackingService (백그라운드 작업 추적)
 ┣ 📂 scheduler/      # NewsScheduler (수집 · 재분석 · 정리)
 ┣ 📂 service/        # NewsCollectorService · AnalyzerService · NotificationService
 ┗ 📂 util/           # IpExtractorUtil · StringListType
src/main/resources/
 ┣ 📜 application.yaml
 ┗ 📂 db/migration/   # Flyway V1 ~ V11
```

---

## 🔌 API 엔드포인트

### Public
| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/news/latest` | 한국어 완성 기사 목록 (페이징) |
| `GET` | `/news/latest?userId=` | 읽지 않은 기사만 조회 |
| `GET` | `/news/search?q=` | 티커 · 회사명 검색 |
| `GET` | `/news/tickers` | 전체 티커 목록 (자동완성용) |
| `GET` | `/health` | 서버 · DB · GenAI 상태 |

### 디바이스 · 읽음
| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/news/device-token` | FCM 토큰 등록 (사용자당 최대 10개) |
| `DELETE` | `/news/device-token` | FCM 토큰 삭제 |
| `POST` | `/news/{id}/read` | 기사 읽음 처리 |

### Admin (`X-Admin-Key` 필요)
| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/news/collect` | 수동 뉴스 수집 |
| `POST` | `/news/reanalyze` | 미분석 기사 재분석 |
| `GET` | `/news/jobs/{jobId}` | 백그라운드 작업 상태 조회 |

---

## ⚙️ 환경변수 (Environment Variables)

| 변수 | 설명 |
|------|------|
| `DB_URL` | Supabase PostgreSQL JDBC URL |
| `DB_USERNAME` | DB 사용자 |
| `DB_PASSWORD` | DB 비밀번호 |
| `FINLIGHT_API_KEY` | Finlight 뉴스 API 키 |
| `GENAI_URL` | GenAI 서버 URL |
| `GENAI_USER` | GenAI Basic Auth 사용자 |
| `GENAI_PASSWORD` | GenAI Basic Auth 비밀번호 |
| `ADMIN_API_KEY` | 관리자 API 키 (최소 16자) |
| `FCM_SERVICE_ACCOUNT_JSON` | Firebase 서비스 계정 JSON |
| `CORS_ORIGINS` | 허용 오리진 (쉼표 구분, 기본값 `*`) |

---

## 🚀 로컬 실행

```bash
cp .env.example .env
# .env 파일에 환경변수 설정 후
./gradlew bootRun
```
