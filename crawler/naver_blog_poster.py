
import os
import json
import time
import random
import pyperclip
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local'))

# Configure Gemini
api_key = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class NaverBlogAutoPoster:
    def __init__(self):
        # 사용자 계정 정보
        self.naver_id = "gksgmlehd1"
        self.naver_pw = "1q2w3e4r5t!!"
        
        # Gemini Model
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Driver Setup
        self.driver = None

    def setup_driver(self):
        chrome_options = Options()
        # chrome_options.add_argument("--headless") # 디버깅을 위해 처음엔 화면 표시
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.implicitly_wait(10)

    def login(self):
        if not self.driver: self.setup_driver()
        
        print(f"Logging in as {self.naver_id}...")
        self.driver.get("https://nid.naver.com/nidlogin.login")
        time.sleep(2)

        # ID 입력 (클립보드 복사 붙여넣기 - 캡차 우회)
        pyperclip.copy(self.naver_id)
        self.driver.find_element(By.ID, "id").click()
        self.driver.find_element(By.ID, "id").send_keys(Keys.CONTROL, 'v')
        time.sleep(1)

        # PW 입력
        pyperclip.copy(self.naver_pw)
        self.driver.find_element(By.ID, "pw").click()
        self.driver.find_element(By.ID, "pw").send_keys(Keys.CONTROL, 'v')
        time.sleep(1)

        # 로그인 버튼 클릭
        self.driver.find_element(By.ID, "log.login").click()
        time.sleep(3)
        
        # 로그인 성공 확인 (새 기기 등록 안함 등 처리 필요할 수 있음)
        # 만약 "새로운 기기 로그인 알림"이 뜨면 "등록안함" 클릭 로직 추가 필요
        try:
            new_device_btn = self.driver.find_element(By.ID, "new.dontsave")
            new_device_btn.click()
            time.sleep(1)
        except:
            pass
            
        print("Login successful!")

    def generate_blog_content(self, news_item):
        """
        Generates a blog post from a news item using Gemini.
        """
        title = news_item.get('free_tier', {}).get('title', '')
        summary = news_item.get('free_tier', {}).get('summary_kr', '')
        insight = news_item.get('vip_tier', {}).get('ai_analysis', {}).get('summary_kr', '')
        source = news_item.get('free_tier', {}).get('original_source', '')
        
        prompt = f"""
        당신은 금융 전문 파워블로거 '코부장'입니다.
        아래 뉴스 정보를 바탕으로 네이버 블로그 포스팅을 작성해주세요.
        
        [뉴스 정보]
        제목: {title}
        출처: {source}
        요약: {summary}
        AI 인사이트: {insight}
        
        [작성 가이드]
        1. 제목은 첫 줄에 작성 (예: "🚨 긴급! 어닝쇼크 발생! 대피하세요")
        2. 본문은 서론-본론-결론 구조
        3. 말투는 친근하지만 확신에 찬 전문가 톤 ("~습니다", "~단언합니다!")
        4. 가독성을 위해 엔터키(줄바꿈)를 자주 사용
        5. 마지막에 #주식 #미국주식 등 해시태그 5개
        6. 이모지 적절히 사용
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Content generation failed: {e}")
            return None

    def post_to_blog(self, title, content):
        if not self.driver: self.login()

        print("Navigating to Blog Write page...")
        # 스마트에디터 ONE URL
        write_url = f"https://blog.naver.com/{self.naver_id}?Redirect=Write&"
        self.driver.get(write_url)
        time.sleep(5)

        # 프레임 전환 (mainFrame)
        try:
            self.driver.switch_to.frame("mainFrame")
            time.sleep(2)
        except:
            print("No mainFrame found, continuing...")

        # 팝업 닫기 (작성 중인 글이 있습니다 등)
        try:
            cancel_btn = self.driver.find_element(By.CSS_selector, ".se-popup-button-cancel")
            if cancel_btn: cancel_btn.click()
        except:
            pass

        # 제목 입력
        print("Writing Title...")
        try:
            # 스마트에디터 ONE의 제목 영역 찾기 (class 기반)
            title_area = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "se-documentTitle"))
            )
            title_area.click()
            pyperclip.copy(title)
            title_area.find_element(By.TAG_NAME, "span").send_keys(Keys.CONTROL, 'v')
            time.sleep(1)
        except Exception as e:
            print(f"Title input failed: {e}")

        # 본문 입력
        print("Writing Content...")
        try:
            # 본문 영역 찾기
            content_area = self.driver.find_element(By.CLASS_NAME, "se-main-container")
            content_area.click()
            
            # 내용을 클립보드에 복사해서 붙여넣기 (빠르고 안정적)
            pyperclip.copy(content)
            
            # ActionChains 또는 그냥 body에 send_keys
            # 스마트에디터는 iframe이 아닐 수 있음 (ONE은 div 편집)
            # 포커스 후 붙여넣기
            webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()
            time.sleep(3)
            
        except Exception as e:
            print(f"Content input failed: {e}")

        # 발행 버튼 클릭
        print("Publishing...")
        try:
            # 1. 상단 '발행' 버튼
            publish_btn1 = self.driver.find_element(By.CLASS_NAME, "publish_btn") # 클래스명 확인 필요 "publish_btn__m9Khh" 등 동적일 수 있음. 보통 "발행" 텍스트로 찾음
            # XPath로 '발행' 텍스트를 가진 버튼 찾기
            publish_btn1 = self.driver.find_element(By.XPATH, "//button[contains(text(), '발행')]")
            publish_btn1.click()
            time.sleep(1)

            # 2. 발행 설정 팝업의 하단 '발행' 버튼
            publish_btn2 = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'confirm_btn')] | //button[span[text()='발행']]"))
            )
            publish_btn2.click()
            
            print(f"Successfully posted: {title}")
            time.sleep(5)
            
        except Exception as e:
            print(f"Publish failed: {e}")


    def load_history(self):
        history_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'posted_history.json')
        if os.path.exists(history_path):
            with open(history_path, 'r', encoding='utf-8') as f:
                return set(json.load(f))
        return set()

    def save_history(self, posted_ids):
        history_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'posted_history.json')
        with open(history_path, 'w', encoding='utf-8') as f:
            json.dump(list(posted_ids), f)

    def run_scheduler(self):
        print("🚀 Naver Blog Auto-Poster Scheduler Started!")
        print("Focus: Breaking News (Impact Score >= 85) & Major Events")
        
        while True:
            try:
                # 1. Load Data
                news_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'us-news-realtime.json')
                posted_ids = self.load_history()
                
                if not os.path.exists(news_file):
                    print("Waiting for news data...")
                    time.sleep(300)
                    continue

                with open(news_file, 'r', encoding='utf-8') as f:
                    news_data = json.load(f)

                # 2. Filter Candidates (High Impact & Not Posted)
                candidates = []
                for item in news_data:
                    # VIP Tier 정보가 없으면 패스
                    if 'vip_tier' not in item: continue
                    
                    impact = item['vip_tier'].get('ai_analysis', {}).get('impact_score', 0)
                    is_breaking = item.get('is_breaking', False)
                    news_id = item.get('id')

                    # 조건: 이미 포스팅 안했고, (임팩트 85 이상 OR 속보)
                    if news_id not in posted_ids and (impact >= 85 or is_breaking):
                        candidates.append((impact, item))

                # 3. Sort by Impact (Highest first)
                candidates.sort(key=lambda x: x[0], reverse=True)

                if candidates:
                    target_score, target_news = candidates[0]
                    print(f"\n[🔥 BREAKING DETECTED] Score: {target_score} | Title: {target_news['free_tier']['title']}")
                    
                    # 4. Generate & Post
                    blog_content = self.generate_blog_content(target_news)
                    if blog_content:
                        lines = blog_content.split('\n')
                        title = lines[0].replace('제목:', '').strip()
                        body = '\n'.join(lines[1:])
                        
                        # 중요도에 따라 제목에 이모지 추가
                        if target_score >= 95:
                            title = "🚨 [긴급속보] " + title
                        elif target_score >= 90:
                            title = "⚡ [필독] " + title
                        
                        self.login()
                        self.post_to_blog(title, body)
                        self.driver.quit() # 메모리 관리를 위해 매번 종료
                        self.driver = None # 초기화
                        
                        # 5. Update History
                        posted_ids.add(target_news['id'])
                        self.save_history(posted_ids)
                        
                        print(f"✅ Posted & Saved. Sleeping for 30 mins to avoid spamming.")
                        time.sleep(1800) # 포스팅 후 30분 휴식
                    else:
                        print("Content generation failed. Skipping.")
                else:
                    print(f"[{datetime.now().strftime('%H:%M')}] No breaking news found. Checking again in 10 mins...")
                    time.sleep(600) # 10분 대기

            except Exception as e:
                print(f"[ERROR] Scheduler loop error: {e}")
                time.sleep(600)

    def run_test_post(self):
        print("🧪 Running Test Post...")
        
        # Test Data
        title = "⚡ [TEST] Stock Empire AI Blog Automation System Check"
        content = """
        안녕하세요, Stock Empire AI 봇입니다. 🤖
        
        이 포스팅은 자동화 시스템의 정상 작동 여부를 확인하기 위한 테스트 게시물입니다.
        
        ✅ 시스템 상태: 정상
        ✅ 게시 시간: {}
        ✅ 버전: v1.0.2 (Selenium Enhanced)
        
        본 게시물은 잠시 후 삭제될 수 있습니다.
        감사합니다.
        """.format(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        
        # Strip indentation for clean posting
        content = '\n'.join([line.strip() for line in content.split('\n')])
        
        try:
            self.login()
            self.post_to_blog(title, content)
            print("✅ Test Post Completed Successfully!")
        except Exception as e:
            print(f"❌ Test Post Failed: {e}")
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Naver Blog Auto Poster')
    parser.add_argument('--test', action='store_true', help='Run a single test post immediately')
    args = parser.parse_args()

    poster = NaverBlogAutoPoster()
    
    if args.test:
        poster.run_test_post()
    else:
        poster.run_scheduler()
