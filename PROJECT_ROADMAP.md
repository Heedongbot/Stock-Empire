---
description: Stock Empire - AI Automated Trading & News Platform Roadmap (Last Updated: 2026-02-07)
---

# 🚀 Stock Empire: Project Roadmap

## 1. Project Vision
Stock Empire is an AI-driven financial platform that provides real-time news, deep macro analysis, and actionable trading signals for both US and Korean markets.

**Core Philosophy:**
- **Institutional Grade:** No retail noise. Only data that moves the market.
- **Persona-Driven AI:** Distinct AI personalities for different tasks (Ko Bujang, Choi Daeri, Kim Daeri).
- **Zero Latency:** Real-time processing and immediate delivery.

---

## 2. Current Architecture (Status: HYBRID)

### 🇺🇸 US Version (VVIP Premium - **CURRENTLY LIVE**)
The US system is highly advanced and fully operational with the "Department Chiefs" system.

| Component | Persona | Function | Status |
| :--- | :--- | :--- | :--- |
| **Macro Intelligence** | **Choi Daeri (최대리)** | Real-time tracking of Fed rates, CPI, GDP, Geopolitics. | ✅ **LIVE** |
| **Alpha Signals** | **Kim Daeri (김대리)** | Technical analysis (RSI, Golden Cross, Volume) + Trading Strategy. | ✅ **LIVE** |
| **Deep Analysis** | **Ko Bujang (코부장)** | Market sentiment analysis, institutional insight, "Buy/Sell" conviction. | ✅ **LIVE** |
| **Data Source** | **Empire Global** | Multi-source aggregation (CNBC, Investing, Seeking Alpha). **NO YAHOO.** | ✅ **LIVE** |

### 🇰🇷 KR Version (Legacy - **NEEDS UPGRADE**)
The Korean system is currently a basic crawler without the advanced AI personas.

| Component | Persona | Function | Status |
| :--- | :--- | :--- | :--- |
| **News Crawler** | *None (Basic Script)* | Simple scraping of Naver Finance News. | ⚠️ **Basic** |
| **Analysis** | *None* | Raw news feed only. No sentiment or deep insight. | ❌ **Missing** |
| **Signals** | *None* | No technical analysis or trading signals yet. | ❌ **Missing** |
| **Data Source** | *Naver Finance* | Single source dependency. | ⚠️ **Single** |

---

## 3. Discrepancy Report (US vs. KR)

**User Question:** *"Is the US version the same as the Korean version?"*
**Answer:** **NO.** They are currently at different evolutionary stages.

- **US Version = Generation 2 (AI Native)**
    - Features: Real-time macro breaking, AI-driven sentiment, distinct personas, multi-source redundancy.
- **KR Version = Generation 1 (Foundation)**
    - Features: Real-time news aggregation, structured data feed. (AI Analysis modules pending integration).

---

## 4. Next Steps & Upgrade Path

To strictly align the Korean version with the high standards of the US version, we need to execute the **"K-Market Modernization Plan"**:

### Phase 1: Deploy "Department Chiefs" to Korea (Week 1)
- [ ] **Assign Choi Daeri to Bank of Korea:** Track BOK rates, KR GDP, Exports data.
- [ ] **Assign Kim Daeri to KOSPI/KOSDAQ:** Implement RSI/Golden Cross logic for Samsung Electronics, SK Hynix, etc.
- [ ] **Assign Ko Bujang to Yeouido:** Analyze Korean market sentiment (Institutional/Foreigner net buying).

### Phase 2: UI Integration (Week 2)
- [x] **Separate Data Streams:** Ensure KR users see KR news, Global users see Global news (Completed).
- [ ] **Cross-Market View:** Create a toggle or split view for US/KR markets in the Newsroom.
- [ ] **Premium UI:** Apply the same "Premium Dark Mode" card design to Korean news.

### Phase 3: Cross-Market Correlation (Week 3)
- [ ] AI Analysis of how US Market (Nvidia) impacts KR Market (SK Hynix).
- [ ] Unified "Global Morning Briefing" generating a single report combining both.

---

## 5. Technical Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend/AI:** Python (FastAPI/Scripts), LangChain (planned), OpenAI GPT-4o
- **Data:** 
    - US: `us-news-realtime.json` (Aggregated)
    - KR: `kr_news_latest.json` (Naver) -> *Migrate to `kr-news-realtime.json`*

---

**Authorized by:** Ko Bujang (Head of AI Analysis)
