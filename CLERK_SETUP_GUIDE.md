# 🔐 Stock Empire Clerk Authentication Setup Guide

지휘관님! 로그인 방식을 설정하는 **"관제탑 매뉴얼"**입니다.
코드 수정 없이, **[Clerk 대시보드]**에서 클릭만 하면 로그인 수단이 추가됩니다.

## 1. 로그인 수단 추가 방법 (Google, X, Email 등)

1.  **[Clerk Dashboard](https://dashboard.clerk.com)** 접속
2.  **User & Authentication** > **Social Connections** 메뉴 클릭
3.  원하는 로그인 방식의 **스위치(Toggle)**를 켜세요.
    *   ✅ **Google**: 기본으로 켜져 있습니다.
    *   ✅ **X (Twitter)**: 스위치 켜면 끝! (가장 쉬움)
    *   ✅ **Apple**: 스위치 켜면 끝!
    *   ✅ **Discord**: 스위치 켜면 끝! (개발자 커뮤니티라면 추천)
4.  **저장(Save)** 버튼 누르면 끝!
    *   이제 홈페이지 로그인 창에 자동으로 버튼이 생깁니다.

## 2. 네이버(Naver) & 카카오(Kakao) 로그인
*   **난이도**: ⭐⭐⭐⭐⭐ (헬)
*   **이유**: 한국 포털은 "사업자 등록증"과 "서비스 심사"를 요구합니다.
*   **방법**:
    1.  네이버 디벨로퍼스 센터 가입
    2.  애플리케이션 등록 (사업자 정보 입력)
    3.  Client ID, Secret 발급
    4.  Clerk 대시보드 > Social Connections > Naver 선택 > ID/Secret 입력
    *   *추천: 법인 설립 후 진행하시는 것이 정신 건강에 좋습니다.*

## 3. 이메일 로그인 (ID/PW)
*   **Email, Password, Username** > **Email** 섹션에서 설정 가능합니다.
*   "Magic Link" (비밀번호 없이 이메일로 링크 받기)도 설정 가능합니다.

---

### 🚨 가장 중요한 것! (Key 설정)
로그인 기능이 작동하려면 **API Key**가 프로젝트에 연결되어야 합니다.

1.  Clerk 대시보드 > **API Keys** 메뉴 클릭
2.  **Publishable key**와 **Secret key** 복사
3.  VS Code 프로젝트 폴더의 `.env.local` 파일을 만들고 붙여넣기:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    ```
4.  **서버 재시작** (`npm run dev` 껐다 켜기)

이것만 해주시면 **"글로벌 통합 로그인 시스템"**이 완성됩니다! 🫡
