"""
US Stock News Crawler (Live & Translated)
- Source: Yahoo Finance RSS, Investing.com
- Feature: Korean Translation, Breaking News Detection, 30-min Interval
"""

import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import time
import random
from deep_translator import GoogleTranslator
from openai import OpenAI
from dotenv import load_dotenv

# Load local environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'))

class StockNewsCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
        self.output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'us-news-realtime.json')
        self.translator = GoogleTranslator(source='auto', target='ko')
        self.cached_ids = set()
        
        # Initialize OpenAI if key exists
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None
        if self.client:
            print("[INFO] OpenAI Intelligence Engine: ACTIVE")
        else:
            print("[WARN] OpenAI Key missing. Falling back to Heuristic Reasoning.")

    def translate(self, text):
        try:
            if not text: return ""
            # Prevent translating short technical terms that should remain English
            upper_text = text.strip().upper()
            if len(upper_text) < 5 and upper_text.isalpha():
                return upper_text
            return self.translator.translate(text)
        except Exception as e:
            print(f"[WARN] Translation failed: {e}")
            return text

    def get_ai_insight(self, title, summary, source, sentiment):
        """
        Generates professional investment insight using GPT-4o-mini
        """
        if not self.client:
            return None
            
        try:
            prompt = f"""
            Analyze the following financial news for an elite investment dashboard:
            Source: {source}
            Title: {title}
            Summary: {summary}
            Detected Sentiment: {sentiment}

            Task: Provide a deep, professional investment insight in 1-2 Korean sentences. 
            Do NOT repeat the title. Focus on 'Why this matters' and 'Market implication'.
            Tone: Professional, Cold, Analytical (like a top-tier hedge fund report).
            Avoid: "안녕하세요", "분석 결과", "요약하자면" - start directly with the core insight.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are a senior equity analyst at Stock Empire."},
                          {"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[ERROR] AI Insight generation failed: {e}")
            return None

    def crawl_all_sources(self, limit=20):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Crawling Unified Global Market Sources...")
        news_list = []
        sources = [
            {'name': 'Investing.com', 'url': 'https://www.investing.com/rss/news_25.rss'},
            {'name': 'Seeking Alpha', 'url': 'https://seekingalpha.com/feed.xml'},
            {'name': 'MarketWatch', 'url': 'https://www.marketwatch.com/rss/topstories'},
            {'name': 'CNBC', 'url': 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069'}
        ]
        
        for src in sources:
            try:
                print(f" -> Fetching {src['name']}...")
                response = requests.get(src['url'], headers=self.headers, timeout=10)
                if response.status_code != 200: continue
                    
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item', limit=20) # Expanded pool for better selection
                
                for item in items:
                    title = item.find('title').text.strip()
                    link = item.find('link').text.strip()
                    desc = item.find('description').text.strip() if item.find('description') else title
                    pub_date_raw = item.find('pubDate').text.strip() if item.find('pubDate') else None
                    
                    # --- [NEW] FACT-GATE: DATE VALIDATION ---
                    # Reject news that is older than 3 days or from previous years (prevents 2024 news leaks)
                    if pub_date_raw:
                        try:
                            # Handling various RSS date formats
                            import email.utils
                            pub_dt = email.utils.parsedate_to_datetime(pub_date_raw)
                            now_dt = datetime.now(pub_dt.tzinfo) if pub_dt.tzinfo else datetime.now()
                            diff = now_dt - pub_dt
                            
                            if diff.days > 3:
                                print(f" [SKIP] Old News Detected ({pub_dt.year}-{pub_dt.month}): {title[:30]}...")
                                continue
                        except Exception as e:
                            print(f" [WARN] Date Parse Error: {e}")

                    # --- NOISE & RETAIL DRAMA FILTER ---
                    # Discarding non-institutional/noise news that doesn't affect the Stock Empire
                    noise_keywords = [
                        'prison', 'mom of', 'divorce', 'ramsey', 'lifestyle', 'family',
                        'personal finance', 'how to save', 'scam', 'police', 'accident',
                        'parenting', 'celebrity', 'wedding', 'dating', 'inheritance',
                        'newsletter', 'subscribe', 'sign up', 'exclusive offer', 'free brief',
                        'what does this mean', 'should you buy', 'is it time to', 'why is it',
                        'barchart brief', 'motley fool', 'zacks', 'analyst report:',
                        'pity', 'investors who', 'how i lost', 'story of', 'unlucky',
                        'bitcoin', 'crypto', 'altcoin', 'meme coin', 'doge', 'shiba',
                        'sob story', 'failed', 'bankrupt individual'
                    ]
                    content_to_check = (title + " " + desc).lower()
                    if any(x in content_to_check for x in noise_keywords) or title.strip().endswith('?'):
                        continue
                        
                    pub_date = pub_date_raw if pub_date_raw else datetime.now().isoformat()
                    formatted = self._format_news_item(title, desc, link, pub_date, src['name'])
                    if formatted:
                        news_list.append(formatted)
                    
            except Exception as e:
                print(f"[WARN] {src['name']} error: {e}")
                
        # Shuffle to mix sources
        random.shuffle(news_list)
        return news_list[:limit]

    def _format_news_item(self, title, summary, link, date, source):
        # 1. Financial Term Correction (Fix bad machine translation)
        term_map = {
            'Earnings Call': '실적 발표 컨퍼런스 콜',
            'Transcript': '회의록/스크립트',
            'Revenue': '매출액',
            'Net Income': '당기순이익',
            'EPS': '주당순이익(EPS)',
            'Beat': '예상치 상회(어닝 서프라이즈)',
            'Miss': '예상치 하회(어닝 쇼크)',
            'Guidance': '향후 실적 가이드라인',
            'Dow Jones': '다우 존스 지수',
            'S&P 500': 'S&P 500 지수',
            'Nasdaq': '나스닥 지수',
            'Quarterly': '분기별',
            'Common Stock': '보통주',
            'Selling': '매각/매도',
            'Dilution': '주주가치 희석',
            'Buyback': '자사주 매입',
            'Dividend': '배당금',
            'Rate Hike': '금리 인상',
            'Rate Cut': '금리 인하',
            'Short Squeeze': '숏스퀴즈(공매도 압박)',
            'Bull Run': '상승 랠리',
            'Bear Market': '하락장',
            'Yield': '채권 수익률',
            'Inflation': '인플레이션(물가 상승)'
        }
        
        keywords = (title + " " + summary).lower()
        
        # 2. Advanced Sentiment & Context Analysis
        sentiment = "NEUTRAL"
        # ALPHA CONVICTION FILTER (THE "MONEY" GATEKEEPER)
        alpha_keywords = [
            'upgrade', 'downgrade', 'price target', 'guidance', 'acquisition', 'merger',
            'earnings beat', 'earnings miss', 'buyback', 'dividend', 'fda', 'sec', 
            'settlement', 'contract', 'partnership', 'massive', 'breakout', 'deal',
            'insider buy', 'tender offer', 'spinoff', 'ipo', 'outlook', 'forecast',
            'expansion', 'investment', 'regulatory', 'monetary', 'strategy', 'revenue'
        ]
        
        major_tickers = [
            'nvda', 'tsla', 'aapl', 'msft', 'goog', 'amd', 'meta', 'amzn', 'nflx', 'avgo',
            'asml', 'trmp', 'pltr', 'smci', 'arm', 'mu', 'mstr', 'coin', 'ibm', 'intc', 'v', 'ma', 'jpm'
        ]

        has_alpha = any(x in keywords for x in alpha_keywords)
        has_major_ticker = any(f" {t} " in f" {keywords} " or keywords.startswith(t) for t in major_tickers)
        
        # Bullish Clusters
        bull_weights = ['rise', 'jump', 'soar', 'surge', 'gain', 'high', 'bull', 'growth', 'profit', 'up', 'record', 'outperform', 'buyback', 'dividend', 'expand', 'beat', 'exceed', 'positive', 'upgrade', 'all-time high']
        # Bearish Clusters
        bear_weights = ['fall', 'drop', 'plunge', 'sink', 'loss', 'low', 'bear', 'crash', 'down', 'crisis', 'risk', 'underperform', 'dilution', 'offering', 'sell stock', 'debt', 'layoff', 'cut', 'disposal', 'scandal', 'lawsuit', 'sell', 'sold']
        
        # 1. Macro Breaking Detection (Always bypasses filter)
        is_breaking = False
        macro_indicators = ['fomc', 'fed', 'cpi', 'pce', 'gdp', 'payrolls', 'unemployment', 'inflation', 'rate hike', 'rate cut']
        if any(x in keywords for x in macro_indicators):
            is_breaking = True

        # 2. Heuristic Sentiment Analysis
        bull_score = sum(1 for x in bull_weights if x in keywords)
        bear_score = sum(1 for x in bear_weights if x in keywords)

        # 3. ALPHA GATEKEEPER - Only keep if it's Macro OR has Alpha Keyword OR Significant Ticker move
        if not is_breaking:
            if not has_alpha:
                if not (has_major_ticker and (bull_score >= 1 or bear_score >= 1)):
                    return None # Drop noise/low-impact news
        
        # Determine specific sentiment
        if bull_score > bear_score: sentiment = "BULLISH"
        elif bear_score > bull_score: sentiment = "BEARISH"
        else: sentiment = "NEUTRAL"

        # 4. Filter Calibration
        if not is_breaking and bull_score == 0 and bear_score == 0:
            return None # Toss generic fluff

        # 5. Translation with Term Mapping
        title_kr = self.translate(title)
        for en, kr in term_map.items():
            title_kr = title_kr.replace(en, kr)
            title_kr = title_kr.replace("수입 통화", "실적 발표")
            title_kr = title_kr.replace("수입 전화", "실적 발표")
            
        summary_kr = self.translate(summary[:300])
        
        # 6. Empire AI Dynamic Reasoning (Prioritize OpenAI)
        ai_insight = self.get_ai_insight(title, summary, source, sentiment)
        
        if not ai_insight:
            # Fallback to High-Quality Institutional Reasoning
            impact_score = min(94, 58 + (max(bull_score, bear_score) * 7) + random.randint(0, 5))
            
            if sentiment == "BULLISH":
                if 'upgrade' in keywords or 'price target' in keywords:
                    ai_insight = f"[미장 속보 분석] 주요 투자은행(IB)의 투자의견 상향은 기관 자금 유입의 강력한 트리거입니다. 현재 차트상 주요 지지선을 확보한 상태로, 단기적으로 약 10~15%의 업사이드가 열려 있습니다. 한국 투자자들은 환율 변동성을 고려하여 실시간 분할 매수 관점이 유효합니다."
                elif 'beat' in keywords or 'guidance' in keywords:
                    ai_insight = f"[어닝 서프라이즈] 예상치를 상회하는 실적 가이드라인은 펀더멘털의 고성장을 증명합니다. 단순 등락을 떠나 주가 재평가(Re-rating)가 시작되는 구간이므로, 장기적 성장이 기대되는 주도주 중심의 비중 확대 전략을 권장합니다."
                else:
                    ai_insight = f"[코부장 전문 의견] 시장의 강력한 매수세가 확인되는 유의미한 시그널입니다. 특히 나스닥 선물 지수의 흐름과 동조화되고 있어, 추세 추종 매매(Trend Following) 전략이 매우 유리한 구간으로 분석됩니다."
            elif sentiment == "BEARISH":
                if 'offering' in keywords or 'dilution' in keywords or 'sell' in keywords:
                    ai_insight = f"[리스크 감지] 유상증자 및 주주가치 희석 소식은 기관들의 이탈 신호입니다. Empire AI는 이를 강력한 하방 변곡점으로 분석하며, 성급한 저가 매수보다는 현금 비중을 늘려 리스크를 선제적으로 관리할 것을 강력 권고합니다."
                elif 'crash' in keywords or 'sink' in keywords:
                    ai_insight = f"[긴급 시황] 패닉 셀(Panic Sell) 물량이 출회되며 투심이 급격히 얼어붙고 있습니다. 주요 이동평균선이 무너진 상태이므로, 바닥권이 확인될 때까지는 보수적인 관점에서 관망하되, 낙폭 과대주를 리스트업할 시기입니다."
                else:
                    ai_insight = f"[코부장 주의보] 시장의 하방 압력이 가속화되는 부정적 변동성이 포착됩니다. 미 국채 금리 변동과 함께 보수적인 포지션 유지가 필요하며, 변동성이 잦아들 때까지는 추가 매수를 자제하십시오."
            else:
                if any(x in keywords for x in macro_indicators):
                    ai_insight = f"[거시 지표 브리핑] FOMC/CPI 등 주요 거시 지표 발표를 앞두고 시장의 경계감이 확산되고 있습니다. 지표 결과에 따라 미 증시 방향성이 크게 갈릴 수 있으므로, 발표 전까지는 포트폴리오의 변동성을 줄이는 방어적 포지션이 유리합니다."
                else:
                    ai_insight = "[시황 탐색] 거시적 불확실성으로 인해 시장이 방향성을 탐색하는 중립 구간입니다. 주요 변곡점 돌파를 확인하기 전까지는 공격적인 베팅보다는 소량 분할 매매로 대응하는 것이 현명합니다."
        else:
            # AI insight was successful, calculate a better impact score
            impact_score = min(98, 70 + (max(bull_score, bear_score) * 4) + random.randint(0, 5))
            if is_breaking: impact_score = 99 # Institutional Priority

        return {
            'id': str(hash(link)),
            'ticker': 'US Market',
            'sentiment': sentiment,
            'is_breaking': is_breaking,
            'published_at': date,
            'free_tier': {
                'title': title_kr,
                'title_en': title,
                'summary_kr': summary_kr + "..." if len(summary_kr) > 200 else summary_kr,
                'link': link,
                'original_source': source
            },
            'vip_tier': {
                'ai_analysis': {
                    'summary_kr': ai_insight,
                    'impact_score': impact_score
                },
                'trading_strategy': {
                    'action': "매수" if sentiment == "BULLISH" else "매도" if sentiment == "BEARISH" else "관망",
                    'target_price': "VIP 전용",
                    'stop_loss': "VIP 전용"
                }
            }
        }

    def save(self, data):
        if not data: return
        clean_data = [item for item in data if item is not None]
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(clean_data, f, ensure_ascii=False, indent=2)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Saved {len(clean_data)} items to {self.output_path}")

def main():
    crawler = StockNewsCrawler()
    print("Stock Empire Crawler Started (Interval: 30min)")
    print("Press Ctrl+C to stop.")
    
    while True:
        try:
            news = crawler.crawl_all_sources(limit=15)
            crawler.save(news)
        except Exception as e:
            print(f"[ERROR] Main loop error: {e}")
        
        # Wait 30 minutes
        print("Waiting 30 minutes...")
        time.sleep(1800) 

if __name__ == "__main__":
    main()
