import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

def crawl_naver_finance_news():
    """
    네이버 금융 실시간 속보 크롤링
    Returns: 뉴스 리스트 (딕셔너리 리스트)
    """
    url = "https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    news_list = []
    
    # [조정] 보스의 지시에 따라 최신 '알짜' 뉴스 3페이지만 빠르게 수집
    for page in range(1, 4):
        current_url = f"{url}&page={page}"
        try:
            response = requests.get(current_url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 네이버 금융 뉴스 리스트 구조 파싱
            articles = soup.select('ul.realtimeNewsList li')
            print(f"[{datetime.now()}] 네이버 금융 뉴스 (Page {page}) {len(articles)}개 발견...")

            for article in articles:
                # 제목 및 링크 추출 (구조: dl > dd.articleSubject > a 또는 dl > dt > a)
                title_tag = article.select_one('dd.articleSubject a')
                if not title_tag:
                    title_tag = article.select_one('dt a')
                
                if not title_tag:
                    continue

                title = title_tag.get_text(strip=True)
                href = title_tag['href']
                
                # 절대 경로 지원 및 HTML 엔티티(&section -> §) 오작동 방지
                if href.startswith('http'):
                    link = href
                else:
                    link = "https://finance.naver.com" + href
                
                # 중요: &section_id 가 §ion_id 로 변환되는 현상 방지
                link = link.replace('\xa7', '&sect') # § 기호를 다시 &sect 로 복구
                if '§ion' in link:
                    link = link.replace('§ion', '&section')
                
                # 요약 내용
                summary_tag = article.select_one('dl > dd.articleSummary')
                summary = summary_tag.get_text(strip=True) if summary_tag else ""
                
                # 언론사 및 시간
                press_tag = article.select_one('span.press')
                press = press_tag.get_text(strip=True) if press_tag else "Unknown"
                
                time_tag = article.select_one('span.wdate')
                pub_date = time_tag.get_text(strip=True) if time_tag else str(datetime.now())

                # [필터링] 가치 낮은 뉴스 제외 (포토, 인사, 부고 등)
                exclude_keywords = ['[포토]', '[인사]', '[부고]', '[게시판]', '[모집]']
                if any(k in title for k in exclude_keywords):
                    print(f"  - Skip (Noise): {title}")
                    continue
                
                # 중복 뉴스 및 너무 짧은 뉴스 필터링 (최소 10자)
                if len(title) < 10:
                    continue

                news_data = {
                    "market": "KR",
                    "title": title,
                    "link": link,
                    "summary": summary,
                    "press": press,
                    "published_at": pub_date,
                    "collected_at": str(datetime.now())
                }
                news_list.append(news_data)

        except Exception as e:
            print(f"Error crawling Naver Finance page {page}: {e}")
            continue

    return news_list

if __name__ == "__main__":
    print("=== 국내 뉴스(KR) 수집 시작 ===")
    news = crawl_naver_finance_news()
    
    # 결과 확인용 출력
    print(json.dumps(news[:3], indent=2, ensure_ascii=False))
    print(f"\n총 {len(news)}개의 뉴스를 수집했습니다.")
    
    # 나중에 DB 저장할 때를 대비해 파일로 임시 저장
    with open("kr_news_latest.json", "w", encoding="utf-8") as f:
        json.dump(news, f, indent=2, ensure_ascii=False)
