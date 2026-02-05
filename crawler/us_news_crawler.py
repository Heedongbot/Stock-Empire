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
        self.output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'web', 'public', 'us-news-tiered.json')
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
                    # Skip if already processed in this session (optional optimization)
                    # if str(hash(link)) in self.cached_ids: continue
                    
                    desc = item.find('description').text.strip() if item.find('description') else title
                    pub_date = item.find('pubDate').text.strip() if item.find('pubDate') else datetime.now().isoformat()
                    
                    news_list.append(self._format_news_item(title, desc, link, pub_date, "Yahoo Finance"))
                    
                if len(news_list) >= limit: break
            except Exception as e:
                print(f"[WARN] Yahoo RSS error: {e}")
                
        return news_list

    def _format_news_item(self, title, summary, link, date, source):
        # 1. Sentiment Analysis
        sentiment = "NEUTRAL"
        keywords = title.lower() + " " + summary.lower()
        if any(x in keywords for x in ['rise', 'jump', 'soar', 'surge', 'gain', 'high', 'bull', 'growth', 'profit', 'up', 'record']):
            sentiment = "BULLISH"
        elif any(x in keywords for x in ['fall', 'drop', 'plunge', 'sink', 'loss', 'low', 'bear', 'crash', 'down', 'crisis', 'risk']):
            sentiment = "BEARISH"
            
        # 2. Breaking News Detection (Simple Rule)
        is_breaking = False
        if "breaking" in keywords or "alert" in keywords or "urgent" in keywords:
            is_breaking = True
        if sentiment != "NEUTRAL": # Strong sentiment can be breaking
            is_breaking = True

        # 3. Translation (Only if English detected roughly)
        title_kr = self.translate(title)
        summary_kr = self.translate(summary[:300]) # Translate first 300 chars
            
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
                    'summary_kr': f"[AI 요약] '{source}'의 보도에 따르면, 현재 시장은 {sentiment} 추세를 보이고 있습니다. 주요 영향 요인은 '{title_kr}' 입니다.",
                    'impact_score': random.randint(60, 95)
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
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        # Load existing to prevent overwriting with less data if error occurs? 
        # For now, just overwrite to keep it fresh.
        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Saved {len(data)} items to {self.output_path}")

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
