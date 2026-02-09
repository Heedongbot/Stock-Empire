import sys
import io
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import time
import random
from openai import OpenAI
from dotenv import load_dotenv

# Force UTF-8 encoding for stdout/stderr to avoid CP949 errors on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 환경 변수 로드
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)

class KRNewsCrawler:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'kr-news-realtime.json')
        
        # OpenAI 초기화
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None
        if self.client:
            print("[INFO] Empire KR Intelligence: ACTIVE")
        else:
            print("[WARN] OpenAI Key missing in KR Crawler. Using fallbacks.")

    def get_ai_analysis(self, title, summary):
        """
        네이버 뉴스를 기반으로 코부장 스타일의 AI 분석 생성
        """
        if not self.client:
            return "[분석 대기] AI 엔진 연결이 필요합니다.", 50

        try:
            prompt = f"""
            주식 뉴스 분석:
            제목: {title}
            요약: {summary}

            위 뉴스를 한국 주식 투자자 관점에서 분석하세요.
            1. 30자 이내의 아주 짧고 강렬한 분석 (코부장 스타일: 신중하지만 냉철하게)
            2. 이 뉴스가 주가에 미칠 영향 점수 (0~100)

            반드시 JSON 형식으로만 응답하세요:
            {{"insight": "분석내용", "score": 85}}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "당신은 Stock Empire의 수석 애널리스트 '코부장'입니다."},
                          {"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.3,
                response_format={ "type": "json_object" }
            )
            res = json.loads(response.choices[0].message.content)
            return res.get("insight", ""), res.get("score", 50)
        except Exception as e:
            print(f"[ERROR] AI Analysis failed: {e}")
            return "시장 상황 모니터링 중입니다.", 50

    def crawl(self):
        url = "https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258"
        news_list = []
        
        print(f"[{datetime.now()}] 네이버 금융 뉴스 수집 시작...")

        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.select('ul.realtimeNewsList li')

            for article in articles[:10]: # 최신 뉴스 10개만 집중 분석
                title_tag = article.select_one('dd.articleSubject a') or article.select_one('dt a')
                if not title_tag: continue

                title = title_tag.get_text(strip=True)
                link = "https://finance.naver.com" + title_tag['href']
                summary_tag = article.select_one('dl > dd.articleSummary')
                summary = summary_tag.get_text(strip=True) if summary_tag else ""
                press = (article.select_one('span.press') or article.select_one('span.wdate')).get_text(strip=True)

                # AI 분석 실행
                insight, score = self.get_ai_analysis(title, summary)

                news_data = {
                    "id": str(hash(link)),
                    "market": "KR",
                    "ticker": "KOSPI",
                    "sentiment": "BULLISH" if score > 55 else "BEARISH" if score < 45 else "NEUTRAL",
                    "published_at": str(datetime.now()),
                    "free_tier": {
                        "title": title,
                        "summary_kr": summary,
                        "link": link,
                        "original_source": press
                    },
                    "vip_tier": {
                        "ai_analysis": {
                            "summary_kr": insight,
                            "impact_score": score,
                            "investment_insight": "실시간 수급 데이터 기반 대응 권장"
                        }
                    }
                }
                news_list.append(news_data)

            # 파일 저장
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            with open(self.output_path, "w", encoding="utf-8") as f:
                json.dump(news_list, f, indent=2, ensure_ascii=False)
            print(f"[{datetime.now()}] {len(news_list)}개의 한국 뉴스 분석 완료 및 저장됨.")

            # ------------------------------------------------------------------
            # [자동 포스팅] 티스토리 블로그 발행
            # ------------------------------------------------------------------
            if news_list:
                try:
                    # 상대 경로/절대 경로 import 호환성 처리
                    try:
                        from crawler.tistory_poster import TistoryAutoPoster
                    except ImportError:
                        from tistory_poster import TistoryAutoPoster
                        
                    print("[INFO] Starting Tistory Auto-Posting...")
                    
                    # 가장 최신 중요 뉴스 1개 선정
                    top_news = news_list[0]
                    
                    # 블로그용 제목 및 본문 생성 (HTML 포맷)
                    blog_title = f"[Stock Empire] 🚨 긴급: {top_news['free_tier']['title']}"
                    
                    # AI 분석 내용이 없을 경우 대비
                    ai_score = top_news['vip_tier'].get('ai_analysis', {}).get('impact_score', 50)
                    ai_summary = top_news['vip_tier'].get('ai_analysis', {}).get('summary_kr', 'AI 분석 데이터 없음')
                    
                    blog_content = f"""
                    <h2 style="color: #333; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">📉 시장분석 리포트</h2>
                    <p>안녕하세요, <strong>Stock Empire</strong>의 인공지능 애널리스트입니다.</p>
                    <p>현재 시장에서 가장 주목해야 할 뉴스를 분석해 드립니다.</p>
                    <br>
                    
                    <h3 style="background-color: #f8f9fa; padding: 10px;">📰 {top_news['free_tier']['title']}</h3>
                    <p style="font-size: 16px; line-height: 1.6;">
                    {top_news['free_tier']['summary_kr']}
                    </p>
                    <br>
                    
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f1f8ff;">
                        <h4 style="margin-top: 0; color: #0056b3;">🤖 AI 민감도 분석</h4>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li><strong>🎯 영향력 점수:</strong> {ai_score}/100</li>
                            <li><strong>📢 시장 분위기:</strong> {top_news['sentiment']}</li>
                            <li><strong>💡 한줄 평:</strong> {ai_summary}</li>
                        </ul>
                    </div>
                    
                    <br>
                    <p style="color: #888; font-size: 12px;">※ 본 리포트는 AI에 의해 자동 생성되었으며 투자의 책임은 본인에게 있습니다.</p>
                    <hr>
                    <p align="center">
                        <a href="{top_news['free_tier']['link']}" target="_blank" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">원문 기사 보러가기</a>
                    </p>
                    """
                    
                    # 태그 생성
                    tags = ["주식", "증시", "코스피", "StockEmpire", "자동포스팅"]
                    
                    # 포스팅 실행
                    poster = TistoryAutoPoster()
                    poster.setup_driver()
                    if poster.login():
                        poster.post(title=blog_title, content=blog_content, tags=",".join(tags))
                    poster.close()
                    
                except Exception as e:
                    print(f"[ERROR] Auto-posting failed: {e}")

        except Exception as e:
            print(f"Error: {e}")
            
if __name__ == "__main__":
    crawler = KRNewsCrawler()
    print("Stock Empire KR Crawler Started (Interval: 30min)")
    while True:
        try:
            crawler.crawl()
        except Exception as e:
            print(f"[ERROR] Main loop error: {e}")
        time.sleep(1800)
