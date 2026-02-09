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

# Load environment variables (Multi-Path Attempt + Manual Parser)
def robust_load_env():
    env_paths = [
        os.path.join(os.path.expanduser("~"), "Stock-Empire", ".env"),
        os.path.join(os.getcwd(), ".env"),
    ]
    for p in env_paths:
        if os.path.exists(p):
            load_dotenv(p)
            print(f"[DEBUG] dotenv loaded from: {p}")
            # Manual fallback parser if os.getenv still fails
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        if "=" in line and not line.startswith("#"):
                            k, v = line.strip().split("=", 1)
                            os.environ[k.strip()] = v.strip().strip('"').strip("'")
            except: pass
            break

robust_load_env()

class StockNewsCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
        self.output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'us-news-realtime.json')
        self.translator = GoogleTranslator(source='auto', target='ko')
        
        # [중복 방지] 포스팅 기록 관리
        self.history_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tistory_history.json')
        self.posted_ids = self._load_history()
        
        # [일일 포스팅 제한]
        self.daily_post_count = 0
        self.last_post_date = datetime.now().date()
        
        # Environment variables are loaded in global scope
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("[ERROR] OPENAI_API_KEY not found in environment!")
            self.client = None
        else:
            try:
                # Direct initialization without extra parameters to avoid 'proxies' error
                self.client = OpenAI(api_key=api_key)
            except Exception as e:
                print(f"[ERROR] OpenAI Client Init Failed: {e}")
                self.client = None
        if self.client:
            print("[INFO] OpenAI Intelligence Engine: ACTIVE")
        else:
            print("[WARN] OpenAI Key missing. Falling back to Heuristic Reasoning.")

    def _load_history(self):
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return set(json.load(f))
            except:
                return set()
        return set()

    def _save_history(self):
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(list(self.posted_ids), f)

    def fetch_yahoo_finance(self, limit=10):
        url = "https://finance.yahoo.com/news/rssindex"
        news_items = []
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(res.content, 'xml')
            items = soup.find_all('item')[:limit]
            
            for item in items:
                title = item.title.text
                link = item.link.text
                pub_date = item.pubDate.text
                description = item.description.text if item.description else ""
                
                news_items.append({
                    'id': f"yh_{hash(link)}",
                    'source': 'Yahoo Finance',
                    'title': title,
                    'excerpt': description,
                    'link': link,
                    'time': pub_date,
                    'is_breaking': 'breaking' in title.lower() or 'urgent' in title.lower()
                })
        except Exception as e:
            print(f"[ERROR] Yahoo Finance fetch failed: {e}")
        return news_items

    def fetch_investing_com(self, limit=10):
        url = "https://www.investing.com/news/stock-market-news"
        news_items = []
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(res.content, 'html.parser')
            articles = soup.find_all('article', class_='articleItem')[:limit]
            
            for article in articles:
                text_div = article.find('div', class_='textDiv')
                if not text_div: continue
                
                a_tag = text_div.find('a', class_='title')
                title = a_tag.text.strip()
                link = "https://www.investing.com" + a_tag['href']
                excerpt = text_div.find('p').text.strip()
                time_span = text_div.find('span', class_='date')
                pub_time = time_span.text if time_span else ""
                
                news_items.append({
                    'id': f"iv_{hash(link)}",
                    'source': 'Investing.com',
                    'title': title,
                    'excerpt': excerpt,
                    'link': link,
                    'time': pub_time,
                    'is_breaking': False
                })
        except Exception as e:
            print(f"[ERROR] Investing.com fetch failed: {e}")
        return news_items

    def analyze_with_ai(self, item):
        if not self.client:
            return {
                'impact_score': 50,
                'summary_kr': item['excerpt_kr'],
                'market_sentiment': 'NEUTRAL'
            }
        
        prompt = f"""
        Analyze this US market news for professional stock traders:
        Title: {item['title']}
        Excerpt: {item['excerpt']}
        
        Focus ONLY on financial impact. If the news is not directly related to stock prices, economic data, or market trends, rate it low.
        Return JSON format: 
        {{
            "impact_score": int (0-100, how much will this move the market?),
            "summary_kr": "1-sentence sharp expert analysis in Korean explaining WHY this makes money or saves money",
            "market_sentiment": "BULLISH/BEARISH/NEUTRAL"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            analysis = json.loads(response.choices[0].message.content)
            
            # Filter out "trash" news - strictly require high impact
            if analysis.get('impact_score', 0) < 40:
                print(f"[DEBUG] Filtering out low impact news: {item['title']} (Score: {analysis.get('impact_score')})")
                return None
            return analysis
        except:
            return None

    def crawl_all_sources(self, limit=10):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Crawling US Market News...")
        raw_news = self.fetch_yahoo_finance(limit=limit) + self.fetch_investing_com(limit=limit)
        
        processed_news = []
        for item in raw_news:
            try:
                # Basic Translation
                item['excerpt_kr'] = self.translator.translate(item['excerpt'])
                item['title_kr'] = self.translator.translate(item['title'])
                
                # AI Analysis
                ai_data = self.analyze_with_ai(item)
                
                if ai_data:
                    processed_news.append({
                        'id': item['id'],
                        'timestamp': datetime.now().isoformat(),
                        'source': item['source'],
                        'link': item['link'],
                        'sentiment': ai_data.get('market_sentiment', 'NEUTRAL'),
                        'is_breaking': item['is_breaking'],
                        'free_tier': {
                            'title': item['title_kr'],
                            'summary_kr': item['excerpt_kr']
                        },
                        'vip_tier': {
                            'ai_analysis': {
                                'impact_score': ai_data.get('impact_score', 50),
                                'summary_kr': ai_data.get('summary_kr', '분석 중...')
                            }
                        }
                    })
                # Prevent rate limits
                time.sleep(1)
            except Exception as e:
                print(f"[ERROR] Processing news item failed: {e}")
                
        return processed_news

    def save(self, data):
        if not data: return
        clean_data = [item for item in data if item is not None]
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(clean_data, f, ensure_ascii=False, indent=2)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Saved {len(clean_data)} items to {self.output_path}")

        # ------------------------------------------------------------------
        # [자동 포스팅] 티스토리 블로그 발행 (미국 주식 버전)
        # ------------------------------------------------------------------
        if clean_data:
            try:
                try:
                    from crawler.tistory_poster import TistoryAutoPoster
                except ImportError:
                    from tistory_poster import TistoryAutoPoster
                
                print("[INFO] Starting Tistory Auto-Posting (US Market)...")
                
                if datetime.now().date() != self.last_post_date:
                    self.daily_post_count = 0
                    self.last_post_date = datetime.now().date()
                
                target_news = None
                for item in clean_data:
                    if item.get('is_breaking') and item['id'] not in self.posted_ids:
                        target_news = item
                        break
                        
                if not target_news:
                    for item in clean_data:
                        if item['id'] not in self.posted_ids:
                            target_news = item
                            break
                            
                if not target_news:
                    print("[INFO] No NEW news to post. Skipping...")
                    return

                if self.daily_post_count >= 5 and not target_news.get('is_breaking'):
                    print(f"[INFO] Daily limit ({self.daily_post_count}/5) reached. Skipping non-breaking news.")
                    return

                title_kr = target_news['free_tier']['title']
                summary_kr = target_news['free_tier']['summary_kr']
                ai_summary = target_news['vip_tier']['ai_analysis']['summary_kr']
                impact_score = target_news['vip_tier']['ai_analysis']['impact_score']
                sentiment = target_news['sentiment']
                
                blog_title = f"[Stock Empire] 🇺🇸 미장 속보: {title_kr}"
                blog_content = f"""
                <h2 style="color: #0F172A; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">🇺🇸 미국 증시 AI 속보</h2>
                <p><strong>Stock Empire AI</strong>가 실시간으로 포착한 미국 시장 핵심 뉴스입니다.</p>
                <br>
                <h3 style="background-color: #EFF6FF; padding: 15px; border-left: 5px solid #2563EB;">📰 {title_kr}</h3>
                <p style="font-size: 16px; line-height: 1.7; color: #334155;">{summary_kr}</p>
                <br>
                <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 12px; background-color: #F8FAFC;">
                    <h4 style="margin-top: 0; color: #2563EB;">🤖 AI 워룸(War Room) 분석</h4>
                    <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
                        <li style="margin-bottom: 8px;"><strong>⚡ 파급력 점수:</strong> {impact_score}/100</li>
                        <li style="margin-bottom: 8px;"><strong>🌊 시장 감지:</strong> {sentiment}</li>
                        <li style="margin-top: 12px; font-weight: bold; color: #0F172A;">💡 코부장 Insight:</li>
                        <li style="color: #475569; padding-left: 10px; border-left: 3px solid #CBD5E1;">{ai_summary}</li>
                    </ul>
                </div>
                <br>
                <hr style="border: 0; border-top: 1px dashed #CBD5E1; margin: 30px 0;">
                <div style="text-align: center; background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 35px 25px; border-radius: 20px; color: white;">
                    <h3 style="color: #60A5FA;">"가장 먼저 실시간 속보를 확인하세요"</h3>
                    <a href="https://stock-empire.vercel.app" style="color: #00ffbd;">🚀 실시간 AI 속보 보기</a>
                </div>
                <p style="text-align: center; font-size: 11px;">※ 본 포스팅은 Stock Empire AI 엔진에 의해 자동 생성되었습니다.</p>
                """
                
                tags = ["미국주식", "나스닥", "S&P500", "StockEmpire", "AI투자"]
                poster = TistoryAutoPoster()
                poster.setup_driver()
                
                login_success = poster.login()
                if login_success:
                    if poster.post(title=blog_title, content=blog_content, tags=",".join(tags)):
                        self.posted_ids.add(target_news['id'])
                        self._save_history()
                        self.daily_post_count += 1
                        print(f"[SUCCESS] Tistory post created for: {title_kr}")
                    else:
                        print("[ERROR] Tistory post method failed.")
                else:
                    print("[ERROR] Tistory login failed. Skipping post.")
                
                poster.close()
            except Exception as e:
                print(f"[ERROR] US Auto-posting failed: {e}")

def main():
    crawler = StockNewsCrawler()
    print("Stock Empire Crawler Started (Interval: 30min)")
    while True:
        try:
            news = crawler.crawl_all_sources(limit=15)
            crawler.save(news)
        except Exception as e:
            print(f"[ERROR] Main loop error: {e}")
        time.sleep(1800)

if __name__ == "__main__":
    main()
