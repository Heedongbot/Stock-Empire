import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
}

def test_yahoo():
    url = "https://finance.yahoo.com/news/rssindex"
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {res.status_code}")
        soup = BeautifulSoup(res.content, 'xml')
        items = soup.find_all('item')
        print(f"Found {len(items)} items on Yahoo")
    except Exception as e:
        print(f"Yahoo failed: {e}")

def test_investing():
    url = "https://www.investing.com/news/stock-market-news"
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {res.status_code}")
        soup = BeautifulSoup(res.content, 'html.parser')
        articles = soup.find_all('article', class_='articleItem')
        print(f"Found {len(articles)} items on Investing.com")
    except Exception as e:
        print(f"Investing failed: {e}")

test_yahoo()
test_investing()
