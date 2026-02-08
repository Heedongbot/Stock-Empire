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
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)

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
        
        # Initialize OpenAI if key exists
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None
        if self.client:
            print("[INFO] OpenAI Intelligence Engine: ACTIVE")
        else:
            print("[WARN] OpenAI Key missing. Falling back to Heuristic Reasoning.")

    def _load_history(self):
        try:
            if os.path.exists(self.history_file):
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return set(json.load(f))
        except Exception as e:
            print(f"[WARN] Failed to load history: {e}")
        return set()

    def _save_history(self):
        try:
            with open(self.history_file, 'w', encoding='utf-8') as f:
                json.dump(list(self.posted_ids), f)
        except Exception as e:
            print(f"[WARN] Failed to save history: {e}")

    # ... (methods translate, get_ai_insight, crawl_all_sources, _format_news_item remain unchanged) ...

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
                # 상대 경로/절대 경로 import 호환성 처리
                try:
                    from crawler.tistory_poster import TistoryAutoPoster
                except ImportError:
                    from tistory_poster import TistoryAutoPoster
                
                print("[INFO] Starting Tistory Auto-Posting (US Market)...")
                
                # [중복 방지] 이미 올린 뉴스는 제외하고, 가장 최신 뉴스 선정
                # 우선순위: 1. Breaking News  2. 일반 News (상위권)
                
                target_news = None
                
                # 1. Breaking News 중에서 안 올린 것 찾기
                for item in clean_data:
                    if item.get('is_breaking') and item['id'] not in self.posted_ids:
                        target_news = item
                        break
                        
                # 2. 없다면 일반 뉴스 중에서 안 올린 것 찾기
                if not target_news:
                    for item in clean_data:
                        if item['id'] not in self.posted_ids:
                            target_news = item
                            break
                            
                if not target_news:
                    print("[INFO] No NEW news to post. Skipping...")
                    return

                # 데이터 추출
                title_kr = target_news['free_tier']['title']
                summary_kr = target_news['free_tier']['summary_kr']
                ai_summary = target_news['vip_tier']['ai_analysis']['summary_kr']
                impact_score = target_news['vip_tier']['ai_analysis']['impact_score']
                sentiment = target_news['sentiment']
                
                # 블로그용 제목 (이모지 포함)
                blog_title = f"[Stock Empire] 🇺🇸 미장 속보: {title_kr}"
                
                # 블로그 본문 (HTML + 홍보 링크)
                blog_content = f"""
                <h2 style="color: #0F172A; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">🇺🇸 미국 증시 AI 속보</h2>
                <p><strong>Stock Empire AI</strong>가 실시간으로 포착한 미국 시장 핵심 뉴스입니다.</p>
                <br>
                
                <h3 style="background-color: #EFF6FF; padding: 15px; border-left: 5px solid #2563EB;">📰 {title_kr}</h3>
                <p style="font-size: 16px; line-height: 1.7; color: #334155;">
                {summary_kr}
                </p>
                <br>
                
                <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 12px; background-color: #F8FAFC;">
                    <h4 style="margin-top: 0; color: #2563EB;">🤖 AI 워룸(War Room) 분석</h4>
                    <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
                        <li style="margin-bottom: 8px;"><strong>⚡ 파급력 점수:</strong> <span style="background-color: #FEF3C7; padding: 2px 6px; border-radius: 4px;">{impact_score}/100</span></li>
                        <li style="margin-bottom: 8px;"><strong>🌊 시장 감지:</strong> {sentiment}</li>
                        <li style="margin-top: 12px; font-weight: bold; color: #0F172A;">💡 코부장 Insight:</li>
                        <li style="color: #475569; padding-left: 10px; border-left: 3px solid #CBD5E1;">{ai_summary}</li>
                    </ul>
                </div>
                
                <br>
                <hr style="border: 0; border-top: 1px dashed #CBD5E1; margin: 30px 0;">
                
                <!-- 트래픽 유입용 홍보 섹션 -->
                <div style="text-align: center; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 20px; border-radius: 15px; color: white;">
                    <h3 style="color: #60A5FA; margin-top: 0;">🚀 아직도 뉴스를 직접 찾으시나요?</h3>
                    <p style="margin-bottom: 25px; color: #94A3B8;">
                        <strong>Stock Empire</strong>에서는 전 세계 금융 뉴스를 AI가 24시간 실시간으로 분석해 드립니다.<br>
                        지금 바로 접속해서 <strong>나만의 AI 투자 비서</strong>를 만나보세요.
                    </p>
                    <a href="https://stock-empire.vercel.app" target="_blank" 
                       style="background-color: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                       👉 Stock Empire 무료 사용하기
                    </a>
                </div>
                <br>
                <p style="color: #94A3B8; font-size: 11px; text-align: center;">※ 본 포스팅은 Stock Empire AI 엔진에 의해 자동 생성되었습니다.</p>
                """
                
                # 태그
                tags = ["미국주식", "나스닥", "S&P500", "StockEmpire", "AI투자", "해외주식"]
                
                # 포스팅 실행
                poster = TistoryAutoPoster()
                poster.post(title=blog_title, content=blog_content, tags=tags)
                
                # [성공 시 기록 저장]
                print(f"[SUCCESS] Posted new article: {title_kr}")
                self.posted_ids.add(target_news['id'])
                self._save_history()
                
            except Exception as e:
                print(f"[ERROR] US Auto-posting failed: {e}")

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
