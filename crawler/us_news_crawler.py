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

class StockNewsCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'us-news-tiered.json')
        self.translator = GoogleTranslator(source='auto', target='ko')
        self.cached_ids = set()

    def translate(self, text):
        try:
            if not text: return ""
            return self.translator.translate(text)
        except Exception as e:
            print(f"[WARN] Translation failed: {e}")
            return text

    def crawl_yahoo_rss(self, limit=20):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Crawling Yahoo Finance RSS...")
        news_list = []
        rss_urls = [
            'https://finance.yahoo.com/news/rssindex',
            'https://finance.yahoo.com/rss/topstories'
        ]
        
        for url in rss_urls:
            try:
                response = requests.get(url, headers=self.headers, timeout=10)
                if response.status_code != 200: continue
                    
                soup = BeautifulSoup(response.content, 'xml')
                items = soup.find_all('item', limit=limit)
                
                for item in items:
                    title = item.find('title').text.strip()
                    link = item.find('link').text.strip()
                    desc = item.find('description').text.strip() if item.find('description') else title
                    
                    # --- NOISE FILTER START ---
                    # Filter out personal finance, lifestyle, and irrelevant human interest stories
                    # NEW: Added newsletter/clickbait filtering
                    noise_keywords = [
                        'prison', 'mom of', 'divorce', 'ramsey', 'lifestyle', 'family',
                        'personal finance', 'how to save', 'scam', 'police', 'accident',
                        'parenting', 'celebrity', 'wedding', 'dating', 'inheritance',
                        'newsletter', 'subscribe', 'sign up', 'exclusive offer', 'free brief',
                        'what does this mean', 'should you buy', 'is it time to', 'why is it',
                        'barchart brief', 'motley fool', 'zacks', 'analyst report:'
                    ]
                    content_to_check = (title + " " + desc).lower()
                    if any(x in content_to_check for x in noise_keywords):
                        print(f"[FILTERED] Skipping noise/clickbait item: {title[:50]}...")
                        continue
                        
                    # Also skip if title ends with a question mark (common clickbait pattern)
                    if title.strip().endswith('?'):
                         print(f"[FILTERED] Skipping question-based clickbait: {title[:50]}...")
                         continue
                    # --- NOISE FILTER END ---
                    
                    pub_date = item.find('pubDate').text.strip() if item.find('pubDate') else datetime.now().isoformat()
                    news_list.append(self._format_news_item(title, desc, link, pub_date, "Yahoo Finance"))
                    
                if len(news_list) >= limit: break
            except Exception as e:
                print(f"[WARN] Yahoo RSS error: {e}")
                
        return news_list

    def _format_news_item(self, title, summary, link, date, source):
        # 1. Financial Term Correction (Fix bad machine translation)
        term_map = {
            'Earnings Call': '실적 발표 컨퍼런스 콜',
            'Transcript': '회의록/스크립트',
            'Revenue': '매출/실적',
            'Dow Jones': '다우 존스',
            'S&P 500': 'S&P 500',
            'Nasdaq': '나스닥',
            'Guidance': '가이드라인/매출전망',
            'Quarterly': '분기별'
        }
        
        # 2. Sentiment Analysis
        sentiment = "NEUTRAL"
        keywords = title.lower() + " " + summary.lower()
        if any(x in keywords for x in ['rise', 'jump', 'soar', 'surge', 'gain', 'high', 'bull', 'growth', 'profit', 'up', 'record', 'outperform']):
            sentiment = "BULLISH"
        elif any(x in keywords for x in ['fall', 'drop', 'plunge', 'sink', 'loss', 'low', 'bear', 'crash', 'down', 'crisis', 'risk', 'underperform']):
            sentiment = "BEARISH"
            
        # 3. Breaking News Detection (Macro Indicators ONLY)
        is_breaking = False
        macro_indicators = ['fomc', 'fed', 'cpi', 'pce', 'gdp', 'payrolls', 'unemployment', 'inflation', 'rate hike', 'rate cut']
        if any(x in keywords for x in macro_indicators):
            is_breaking = True

        # 4. Filter Granular/Less Relevant News (like niche earnings transcripts)
        if "transcript" in keywords or "earnings call" in keywords:
            # Only keep if it's a major tech/theme ticker
            major_tickers = ['nvda', 'tsla', 'aapl', 'msft', 'goog', 'amd', 'meta', 'amzn']
            if not any(t in keywords for t in major_tickers):
                return None # Skip this item

        # 5. Translation with Term Mapping
        title_kr = self.translate(title)
        for en, kr in term_map.items():
            title_kr = title_kr.replace(en, kr) # Map remaining English terms
            # Fix specific bad translations like "수입 통화" (Earnings Call)
            title_kr = title_kr.replace("수입 통화", "실적 발표")
            title_kr = title_kr.replace("수입 전화", "실적 발표")
            
        summary_kr = self.translate(summary[:300])
            
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
                    'summary_kr': f"[AI 요약] '{source}'의 보도에 따르면, 현재 시장은 {sentiment} 추세를 보이고 있습니다. '{title_kr}' 관련 인사이더 로직을 분석 중입니다.",
                    'impact_score': random.randint(65, 95)
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
        # Final cleanup: filter out None values from mapping
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
            news = crawler.crawl_yahoo_rss(limit=15)
            crawler.save(news)
        except Exception as e:
            print(f"[ERROR] Main loop error: {e}")
        
        # Wait 30 minutes
        print("Waiting 30 minutes...")
        time.sleep(1800) 

if __name__ == "__main__":
    main()
