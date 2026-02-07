from crawler.us_news_crawler import StockNewsCrawler
import sys

def run_once():
    try:
        crawler = StockNewsCrawler()
        print("Starting one-time crawl with improved AI reasoning...")
        news = crawler.crawl_all_sources(limit=20)
        crawler.save(news)
        print("Done.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    run_once()
