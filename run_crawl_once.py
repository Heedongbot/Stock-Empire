from crawler.us_news_crawler import StockNewsCrawler
from crawler.kr_crawler import KRNewsCrawler
from crawler.alpha_analyzer import AlphaAnalyzer
import sys

def run_once():
    try:
        # 1. Update Premium AI News (US)
        crawler = StockNewsCrawler()
        print("--- [1/3] Updating Premium AI News (US Market) ---")
        news = crawler.crawl_all_sources(limit=30)
        crawler.save(news)
        
        # 2. Update KR Market News
        print("\n--- [2/3] Updating KR Market News ---")
        kr_crawler = KRNewsCrawler()
        kr_crawler.crawl()

        # 3. Update VVIP Alpha Signals
        print("\n--- [3/3] Updating VVIP Alpha Stock Signals ---")
        analyzer = AlphaAnalyzer()
        analyzer.run_pipeline()
        
        print("\n[SUCCESS] All 'Money-Making' systems updated successfully.")
    except Exception as e:
        print(f"\n[ERROR] Update failed: {e}")

if __name__ == '__main__':
    run_once()
