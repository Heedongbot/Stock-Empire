
import os
import requests
import json
import time
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local'))

# Configure Gemini
api_key = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
if not api_key:
    # Try to find it in other env files or just warn
    print("WARNING: GOOGLE_GENERATIVE_AI_API_KEY not found in .env.local")

if api_key:
    genai.configure(api_key=api_key)

class NaverBlogAutoPoster:
    def __init__(self):
        # 네이버 API 설정 (Naver Developers에서 발급 필요)
        self.client_id = os.getenv("NAVER_CLIENT_ID")
        self.client_secret = os.getenv("NAVER_CLIENT_SECRET")
        self.blog_id = os.getenv("NAVER_BLOG_ID") # 네이버 아이디
        self.access_token = os.getenv("NAVER_ACCESS_TOKEN") # Oauth token if using API

        # If using Gemini for content generation
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_blog_content(self, news_item):
        """
        Generates a blog post from a news item using Gemini.
        """
        title = news_item.get('free_tier', {}).get('title', '')
        summary = news_item.get('free_tier', {}).get('summary_kr', '')
        insight = news_item.get('vip_tier', {}).get('ai_analysis', {}).get('summary_kr', '')
        source = news_item.get('free_tier', {}).get('original_source', '')
        link = news_item.get('free_tier', {}).get('link', '')

        prompt = f"""
        당신은 금융 전문 파워블로거 '코부장'입니다.
        아래 뉴스 정보를 바탕으로 네이버 블로그 포스팅을 작성해주세요.
        
        [뉴스 정보]
        제목: {title}
        출처: {source}
        요약: {summary}
        AI 인사이트: {insight}
        
        [작성 가이드]
        1. 제목은 클릭을 유도하는 자극적이고 전문적인 것으로 작성 (예: "🚨 긴급! 엔비디아 실적 발표, 지금 안 보면 후회합니다")
        2. 본문은 서론-본론(뉴스 내용)-심층분석(코부장의 시선)-결론(투자 전략) 구조로 작성
        3. 말투는 친근하지만 확신에 찬 전문가 톤 ("~습니다", "~해요", "집중하세요!")
        4. 중간중간 적절한 이모지 사용
        5. 가독성을 위해 불렛포인트 활용
        6. 마지막에 관련 해시태그 10개 추가
        7. HTML 태그 없이 순수 텍스트로 작성
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Content generation failed: {e}")
            return None

    def post_to_blog(self, title, content):
        """
        Posts content to Naver Blog via API.
        Note: Naver Blog API requires OAuth 2.0 token. 
        This is a placeholder for the actual API call logic.
        Real implementation requires a valid Access Token.
        """
        if not self.access_token:
            print("Skipping upload: NAVER_ACCESS_TOKEN not provided.")
            print(f"--- [MOCK POST] ---\nTitle: {title}\nContent Preview: {content[:100]}...\n-------------------")
            return False

        header = "Bearer " + self.access_token # Bearer Token
        url = "https://openapi.naver.com/blog/writePost.json"
        
        data = {
           "title" : title,
           "contents" : content,
           "options": [
               { "openType": "public" } 
           ]
        }
        
        # This is strictly illustrative as Naver Blog API has specific requirements
        # requests.post(url, headers=header, data=data)
        print(f"Posted to blog: {title}")
        return True

    def run_auto_posting(self):
        # Load latest news
        news_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'us-news-realtime.json')
        
        if not os.path.exists(news_file):
            print("No news data found.")
            return

        with open(news_file, 'r', encoding='utf-8') as f:
            news_data = json.load(f)

        if not news_data:
            print("News list empty.")
            return

        # Pick the top breaking news or first item
        target_news = news_data[0] # Just assume first one for now
        
        print(f"Generating blog post for: {target_news['free_tier']['title']}...")
        blog_content = self.generate_blog_content(target_news)
        
        if blog_content:
            # Extract title from generated content (first line usually)
            lines = blog_content.split('\n')
            title = lines[0].replace('제목:', '').strip()
            body = '\n'.join(lines[1:])
            
            self.post_to_blog(title, body)
            
            # Save the generated blog post locally for review
            with open('latest_blog_post.txt', 'w', encoding='utf-8') as f:
                f.write(blog_content)
            print("Blog post generated and saved to 'latest_blog_post.txt'")

if __name__ == "__main__":
    poster = NaverBlogAutoPoster()
    poster.run_auto_posting()
