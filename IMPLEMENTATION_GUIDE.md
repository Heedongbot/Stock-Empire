# Stock Empire - 등급별 뉴스 시스템 적용 가이드

## ✅ 완료된 작업

### 1. 데이터 구조 생성
- ✅ `us-news-tiered.json` - 등급별 뉴스 데이터
- ✅ `TieredNewsCard.tsx` - 등급별 뉴스 카드 컴포넌트
- ✅ `BUSINESS_MODEL.md` - 비즈니스 전략 문서

### 2. 컴포넌트 업데이트
- ✅ TieredNewsCard import 추가
- ✅ userTier state 추가 (FREE/VIP/VVIP)
- ✅ 뉴스 데이터 소스 변경 (us-news-tiered.json)

---

## 🚀 다음 단계: 메인 페이지 적용

### Step 1: page.tsx 수정

**위치**: `stock-empire/web/app/page.tsx` 라인 251-258

**기존 코드**:
```typescript
{/* US News Grid - 12 items */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {usNews.length > 0 ? usNews.slice(0, 12).map((item, idx) => (
    <NewsCard key={`us-${idx}`} item={item} idx={idx} isUS={true} />
  )) : (
    <div className="col-span-4 ...">본토 신규 시그널을 수집 중입니다...</div>
  )}
</div>
```

**새 코드**:
```typescript
{/* US News Grid - Tiered Access */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {usNews.length > 0 ? usNews.slice(0, 12).map((item, idx) => (
    <TieredNewsCard key={`us-${idx}`} news={item} userTier={userTier} />
  )) : (
    <div className="col-span-2 ...">본토 신규 시그널을 수집 중입니다...</div>
  )}
</div>
```

---

### Step 2: 등급 전환 UI 추가

**위치**: 네비게이션 바에 등급 전환 버튼 추가

```typescript
{/* Tier Selector - for testing */}
<div className="flex items-center gap-2">
  <button 
    onClick={() => setUserTier("FREE")}
    className={`px-3 py-1 rounded text-xs font-bold ${
      userTier === "FREE" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-500"
    }`}
  >
    FREE
  </button>
  <button 
    onClick={() => setUserTier("VIP")}
    className={`px-3 py-1 rounded text-xs font-bold ${
      userTier === "VIP" ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-500"
    }`}
  >
    VIP
  </button>
  <button 
    onClick={() => setUserTier("VVIP")}
    className={`px-3 py-1 rounded text-xs font-bold ${
      userTier === "VVIP" ? "bg-yellow-600 text-white" : "bg-slate-900 text-slate-500"
    }`}
  >
    VVIP
  </button>
</div>
```

---

### Step 3: 멤버십 가격 업데이트

**위치**: `page.tsx` 라인 264-340 (MEMBERSHIP SECTION)

**FREE 플랜 업데이트**:
```typescript
<h4>Free Recruit</h4>
<p>₩0 <span>/ month</span></p>
<ul>
  <li>✓ 일 3건 뉴스 조회</li>
  <li>✓ 기본 번역 + 요약</li>
  <li className="opacity-20">✗ AI 분석 (VIP 전용)</li>
  <li className="opacity-20">✗ 과거 데이터 (VVIP 전용)</li>
</ul>
```

**VIP 플랜 업데이트**:
```typescript
<h4>VIP Commander</h4>
<p>₩19,900 <span>/ month</span></p>
<p className="text-xs text-green-400">일일 약 ₩660 = 커피 한 잔 값</p>
<ul>
  <li>✓ 무제한 뉴스 조회</li>
  <li>✓ AI 핵심 분석</li>
  <li>✓ 투자 인사이트</li>
  <li>✓ 감정 분석 상세</li>
  <li className="opacity-20">✗ 과거 데이터 (VVIP 전용)</li>
</ul>
<p className="text-xs">연간 ₩199,000 (17% 할인)</p>
```

**VVIP 플랜 업데이트**:
```typescript
<h4>VVIP Supreme</h4>
<p>₩49,900 <span>/ month</span></p>
<p className="text-xs text-yellow-400">월 5만원으로 AI 펀드매니저 고용</p>
<ul>
  <li>✓ VIP 모든 기능</li>
  <li>✓ 과거 유사 이벤트 분석</li>
  <li>✓ AI 기술적 분석 시나리오</li>
  <li>✓ 매매 전략 제시</li>
  <li>✓ 리스크 분석</li>
  <li>✓ AI 마스터 코멘트</li>
</ul>
<p className="text-xs">연간 ₩499,000 (17% 할인)</p>
```

---

## 🎨 UI 개선 사항

### 1. 등급별 색상 테마
- **FREE**: 회색 (slate)
- **VIP**: 보라색 (purple)
- **VVIP**: 금색 (yellow/gold)

### 2. 업그레이드 프롬프트
- 성과 데이터 표시 (평균 수익률, 승률)
- 심리적 가격 메시지
- 7일 무료 체험 + 30일 환불 보장

### 3. 법적 면책 조항
- 모든 뉴스 카드 하단에 표시
- "투자 권유가 아닌 정보 제공"
- "과거 데이터는 미래 수익 보장 안 함"

---

## 🧪 테스트 방법

### 1. 개발 서버 실행
```bash
cd stock-empire/web
npm run dev
```

### 2. 브라우저에서 확인
- http://localhost:3000
- 네비게이션 바에서 FREE/VIP/VVIP 전환
- 각 등급별로 표시되는 콘텐츠 확인

### 3. 체크리스트
- [ ] FREE: 기본 요약만 표시
- [ ] VIP: AI 분석 + 업그레이드 프롬프트 (VVIP)
- [ ] VVIP: 모든 콘텐츠 표시
- [ ] 업그레이드 버튼 클릭 시 가격 정보 표시
- [ ] 법적 면책 조항 표시

---

## 📊 예상 효과

### 전환율 예상
- FREE → VIP: 5-10% (일반적)
- VIP → VVIP: 15-20% (높은 편)

### 수익 시뮬레이션 (6개월 후)
- FREE: 10,000명
- VIP: 500명 × ₩19,900 = ₩9,950,000/월
- VVIP: 100명 × ₩49,900 = ₩4,990,000/월
- **총 월 수익**: ₩14,940,000

---

## 🚀 다음 작업

1. ✅ 등급별 뉴스 시스템 구축
2. 🔄 메인 페이지 적용 (진행 중)
3. ⏳ Stripe 결제 연동
4. ⏳ 사용자 인증 시스템
5. ⏳ 얼리버드 론칭 페이지

---

*작성일: 2026-02-03*
*작성자: Stock Empire Team*
