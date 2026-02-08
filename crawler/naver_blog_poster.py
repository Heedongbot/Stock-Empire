
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
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # 윈도우 Chrome 경로 명시적 지정
        user_home = os.path.expanduser("~")
        paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.join(user_home, r"AppData\Local\Google\Chrome\Application\chrome.exe")
        ]
        
        for p in paths:
            if os.path.exists(p):
                chrome_options.binary_location = p
                print(f"[INFO] Using Chrome binary at: {p}")
                break
        
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

    def post_to_blog(self, title, content):
        if not self.driver: self.login()

        print("[INFO] Navigating to Blog Write page...")
        write_url = f"https://blog.naver.com/{self.naver_id}?Redirect=Write&"
        self.driver.get(write_url)
        time.sleep(5)

        # 프레임 전환 (mainFrame)
        try:
            print("[INFO] Switching to mainFrame...")
            WebDriverWait(self.driver, 10).until(EC.frame_to_be_available_and_switch_to_it("mainFrame"))
        except Exception as e:
            print(f"[ERROR] Failed to switch to mainFrame: {e}")
            return False

        # 팝업 및 도움말 닫기
        try:
            # 팝업 닫기 시도 (여러 종류)
            popups = [".se-popup-button-cancel", ".se-help-panel-close-button", ".se-help-header-close-button"]
            for selector in popups:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                for el in elements:
                    if el.is_displayed():
                        self.driver.execute_script("arguments[0].click();", el)
                        print(f"[INFO] Closed popup: {selector}")
                        time.sleep(0.5)
        except:
            pass

        # 제목 입력
        print("[INFO] Writing Title...")
        try:
            # 발행 단어 유니코드 (발행)
            PUBLISH_TEXT = "\ubc1c\ud589" 
            
            title_area = WebDriverWait(self.driver, 15).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "se-documentTitle"))
            )
            title_area.click()
            time.sleep(0.5)
            pyperclip.copy(title)
            webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()
            time.sleep(1)
            
            # 제목 칸 탈출 (완전하게)
            print("[INFO] Exiting title field...")
            self.driver.execute_script("document.activeElement.blur(); window.getSelection().removeAllRanges();")
            time.sleep(1)
        except Exception as e:
            print(f"[ERROR] Title input failed: {e}")
            return False

        # 본문 입력
        print("[INFO] Writing Content...")
        try:
            # 본문 영역 강제 활성화 (정중앙 클릭 + 스페이스)
            self.driver.execute_script("window.scrollTo(0, 500);")
            time.sleep(1)
            # 자바스크립트로 본문 영역 강제 클릭
            self.driver.execute_script("var el = document.querySelector('.se-main-container'); if(el) el.click();")
            time.sleep(0.5)
            webdriver.ActionChains(self.driver).send_keys(Keys.SPACE).perform()
            time.sleep(1)
            
            pyperclip.copy(content)
            webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()
            time.sleep(3)
            
        except Exception as e:
            print(f"[ERROR] Content input failed: {e}")
            return False

        # 발행 버튼 클릭 (전방위 무차별 타격 로직)
        def multi_click_publish(label_k):
            print(f"[INFO] Multi-scanning for '{label_k}'...")
            script = """
                var label = arguments[0];
                var regex = new RegExp(label);
                // 방해 요소 제거
                document.querySelectorAll('.se-help-header, .se-popup-close').forEach(el => el.style.display = 'none');
                
                var all = Array.from(document.querySelectorAll('button, span, div, a, [role="button"]'));
                var targets = all.filter(el => {
                    var text = (el.innerText || el.textContent || "").trim();
                    var aria = el.getAttribute('aria-label') || "";
                    return (regex.test(text) || regex.test(aria)) && el.offsetParent !== null;
                });
                
                if (targets.length > 0) {
                    console.log("[JS] Found " + targets.length + " targets.");
                    targets.forEach(t => {
                        try { t.click(); } catch(e) {}
                        // 마우스 이벤트 시뮬레이션
                        ['mousedown', 'mouseup', 'click'].forEach(name => {
                            var ev = new MouseEvent(name, {bubbles: true, cancelable: true, view: window});
                            t.dispatchEvent(ev);
                        });
                    });
                    return true;
                }
                return false;
            """
            return self.driver.execute_script(script, label_k)

        try:
            PUBLISH_K = "\ubc1c\ud589"
            
            # 1단계: 발행 버튼 클릭
            if not multi_click_publish(PUBLISH_K):
                print("[WARN] 1st button not found, trying backup...")
                self.driver.execute_script("document.querySelector('button[class*=\"publish\"]').click();")
            
            time.sleep(4) 

            # 2단계: 최종 확인 버튼 (팝업 내)
            print("[INFO] Attempting final confirmation...")
            multi_click_publish(PUBLISH_K)
            time.sleep(2)
            # 엔터 백업
            webdriver.ActionChains(self.driver).send_keys(Keys.ENTER).perform()

            # 성공 확인 (프레임 탈출 후 URL 체크)
            self.driver.switch_to.default_content()
            print("[INFO] Final URL verification...")
            success = False
            for _ in range(15):
                curr_url = self.driver.current_url
                if "Write" not in curr_url and "blog.naver.com" in curr_url:
                    print(f"[SUCCESS] Posted successfully!")
                    success = True
                    break
                time.sleep(1)
            
            if not success:
                self.driver.save_screenshot("publish_error.png")
                raise Exception(f"URL did not change. Current: {self.driver.current_url}")
            
            return True
            
        except Exception as e:
            print(f"[ERROR] Publish failed: {e}")
            return False


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
        print("[START] Naver Blog Auto-Poster Scheduler Started!")
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
                    print(f"\n[BREAKING DETECTED] Score: {target_score} | Title: {target_news['free_tier']['title']}")
                    
                    # 4. Generate & Post
                    blog_content = self.generate_blog_content(target_news)
                    if blog_content:
                        lines = blog_content.split('\n')
                        title = lines[0].replace('제목:', '').strip()
                        body = '\n'.join(lines[1:])
                        
                        # 중요도에 따라 제목에 이모지 추가 (블로그 제목에는 이모지 가능)
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
                        
                        print(f"[SUCCESS] Posted & Saved. Sleeping for 30 mins to avoid spamming.")
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
        print("[TEST] Running Test Post...")
        
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
            result = self.post_to_blog(title, content)
            
            if result:
                print("[SUCCESS] Test Post Completed Successfully!")
            else:
                 print("[ERROR] Test Post Failed!")

        except Exception as e:
            print(f"[ERROR] Test Post Failed: {e}")
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
