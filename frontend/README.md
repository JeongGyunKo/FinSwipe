# 🚀 FinSwipe (핀스와이프)
> **사용자 취향 저격 금융 뉴스 큐레이션 서비스**  
> 수많은 금융 뉴스를 티커(Ticker)별로 스와이프하며 당신의 포트폴리오에 필요한 정보만 골라보세요.

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=Supabase&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black">
  <img src="https://img.shields.io/badge/GA4-E37400?style=for-the-badge&logo=Google%20Analytics&logoColor=white">
</p>

---

## ✨ 핵심 기능 (Key Features)

*   **📰 티커별 뉴스 그룹화**: `useEffect`와 커스텀 로직을 활용해 흩어진 뉴스 데이터를 종목(Ticker)별로 자동 분류하여 제공합니다.
*   **🎯 개인화된 피드**: 사용자가 설정한 관심 종목 데이터를 기반으로 필터링된 맞춤형 뉴스 리스트를 렌더링합니다.
*   **📱 PWA(Progressive Web App)**: `vite-plugin-pwa`를 적용하여 오프라인 환경에서도 뉴스 조회가 가능하며, 네이티브 앱과 유사한 사용자 경험을 제공합니다.
*   **🔔 실시간 푸시 알림**: Firebase Cloud Messaging(FCM) 서비스 워커를 구현하여 백그라운드 상태에서도 실시간 주요 뉴스 알림을 수신합니다.
*   **📊 사용자 경험 최적화**: GA4를 연동하여 유저의 정렬 방식 선호도(시간순 vs 파워순)를 추적하고 서비스 고도화에 활용합니다.

---

## 🛠 기술 스택 및 라이브러리 (Tech Stack)

### **Frontend**
*   **Library**: React 18
*   **Build Tool**: Vite
*   **Language**: TypeScript (Strict Mode)
*   **State Management**: React Hooks (Custom Hooks 기반 로직 분리)
*   **Analytics**: `react-ga4` (사용자 행동 추적 및 데이터 세니타이징 구현)

### **Infrastructure Integration (BaaS)**
*   **Authentication & DB**: Supabase (유저 프로필 및 티커 관심 목록 관리)
*   **Cloud Messaging**: Firebase (FCM 서비스 워커를 통한 백그라운드 푸시 구현)

---

## 📐 프로젝트 구조 (Project Structure)
```bash
src/
 ┣ 📂 components/     # 재사용 가능한 UI 컴포넌트
 ┣ 📂 hooks/          # 비즈니스 로직 캡슐화를 위한 커스텀 훅
 ┣ 📂 lib/            # 외부 서비스 연동 로직
 ┃ ┣ 📂 analytics/    # GA4 이벤트 정의 및 데이터 정제(Sanitize) 로직
 ┃ ┣ 📂 supabase/     # DB 클라이언트 설정
 ┃ ┗ 📂 firebase/     # FCM 메시징 설정
 ┣ 📂 types/          # 전역 타입 및 GA 이벤트 인터페이스 정의
 ┗ 📜 main.tsx
public/
 ┗ 📜 firebase-messaging-sw.js  # 백그라운드 푸시 수신 서비스 워커
