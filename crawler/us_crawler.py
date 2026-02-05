import yfinance as yf
import json
from datetime import datetime
import time

def crawl_yahoo_finance_news():
    """
    Yahoo Finance 주요 뉴스 수집 (yfinance 라이브러리 활용)
    Returns: 뉴스 리스트
    """
    print(f"[{datetime.now()}] Yahoo Finance 뉴스 수집 중...")
    
    # ... (tickers list remains same)
    tickers = [
        "^GSPC", "^IXIC", "^DJI", # 3대 지수
        "NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", # Mag 7
        "AMD", "INTC", "TSM", "AVGO", "MU", # 반도체
        "PLTR", "ARM", "COIN" # 핫이슈
    ]
    
    all_news = []
    seen_uuids = set() # 중복 제거용

    for symbol in tickers:
        print(f"  > Fetching: {symbol}...")
        time.sleep(1.0) # Rate Limit 방지
        try:
            ticker = yf.Ticker(symbol)
            news_items = ticker.news
            
            if not news_items:
                print(f"    - No news found for {symbol}")
                continue
            
            for item in news_items:
                uuid = item.get('uuid')
                if uuid in seen_uuids:
                    continue
                
                seen_uuids.add(uuid)
                
                # yfinance 뉴스 구조가 변경될 수 있음을 고려하여 필드 추출
                title = item.get('title')
                link = item.get('link')
                
                # 가끔 뉴스 데이터가 'content' 내부에 있는 경우가 있음
                if not title and 'content' in item:
                    title = item['content'].get('title')
                if not link and 'content' in item:
                    link = item['content'].get('clickThroughUrl', {}).get('url') or item['content'].get('link')

                if not title or not link:
                    # Debug: print(f"Missing title/link in item: {item.keys()}")
                    continue
                
                # Unix timestamp 변환
                pub_ts = item.get('providerPublishTime') or item.get('content', {}).get('pubDate')
                # pub_ts가 문자열인 경우 처리 (일부 구조에서는 문자열로 옴)
                if isinstance(pub_ts, str):
                    pub_date = pub_ts 
                elif pub_ts:
                    pub_date = datetime.fromtimestamp(pub_ts).strftime('%Y-%m-%d %H:%M:%S')
                else:
                    pub_date = str(datetime.now())

                news_data = {
                    "market": "US",
                    "ticker": symbol,
                    "title": title,
                    "link": link,
                    "publisher": item.get('publisher'),
                    "published_at": pub_date,
                    "collected_at": str(datetime.now())
                }
                all_news.append(news_data)
                
        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")

    return all_news

if __name__ == "__main__":
    print("=== 해외 뉴스(US) 수집 시작 ===")
    news = crawl_yahoo_finance_news()
    
    # 결과 확인용 출력
    print(json.dumps(news[:3], indent=2, ensure_ascii=False))
    print(f"\n총 {len(news)}개의 글로벌 뉴스를 수집했습니다.")

    # 파일로 저장
    with open("us_news_latest.json", "w", encoding="utf-8") as f:
        json.dump(news, f, indent=2, ensure_ascii=False)
