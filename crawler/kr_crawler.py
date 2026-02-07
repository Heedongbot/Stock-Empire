import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import time
import random
from openai import OpenAI
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'))

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

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    crawler = KRNewsCrawler()
    crawler.crawl()
