from crawler.us_news_crawler import StockNewsCrawler
from crawler.alpha_analyzer import AlphaAnalyzer
import sys

def run_once():
    try:
        # 1. Update Premium AI News
        crawler = StockNewsCrawler()
        print("--- [1/2] Updating Premium AI News (Money-Focused) ---")
        news = crawler.crawl_all_sources(limit=30)
        crawler.save(news)
        
        # 2. Update VVIP Alpha Signals
        print("\n--- [2/2] Updating VVIP Alpha Stock Signals ---")
        analyzer = AlphaAnalyzer()
        analyzer.run_pipeline()
        
        print("\n[SUCCESS] All 'Money-Making' systems updated successfully.")
    except Exception as e:
        print(f"\n[ERROR] Update failed: {e}")

if __name__ == '__main__':
    run_once()
