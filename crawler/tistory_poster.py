from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from dotenv import load_dotenv

# Load environment variables (Extra Robust Manual Parser)
def robust_load_env():
    print("[INFO] Starting robust_load_env sequence...")
    env_paths = [
        os.path.join(os.path.expanduser("~"), "Stock-Empire", ".env"),
        "/home/ubuntu/Stock-Empire/.env",
        os.path.join(os.getcwd(), ".env"),
    ]
    found_keys = []
    
    for p in env_paths:
        print(f"[DEBUG] Checking path: {p}")
        if os.path.exists(p):
            print(f"[DEBUG] File EXISTS at: {p}")
            try:
                with open(p, "r", encoding="utf-8", errors='replace') as f:
                    content = f.read()
                    print(f"[DEBUG] File size: {len(content)} bytes")
                    f.seek(0)
                    for line in f:
                        line = line.strip()
                        if "=" in line and not line.startswith("#"):
                            k, v = line.split("=", 1)
                            key = k.strip()
                            val = v.strip().strip('"').strip("'").strip()
                            os.environ[key] = val
                            found_keys.append(key)
                print(f"[DEBUG] FOUND KEYS IN THIS FILE: {', '.join(found_keys)}")
                if "TISTORY_ID" in found_keys:
                    print(f"[SUCCESS] TISTORY_ID detected in file!")
            except Exception as e:
                print(f"[ERROR] Failed to manually read .env: {e}")
            break
    
    # Backup method
    load_dotenv()

robust_load_env()

TISTORY_ID = os.getenv("TISTORY_ID")
TISTORY_PW = os.getenv("TISTORY_PW")
TISTORY_BLOG_NAME = os.getenv("TISTORY_BLOG_NAME")

# --- BOOS SPECIAL FALLBACK (코부장의 원격 지원) ---
if not TISTORY_ID or "보스님" in TISTORY_ID:
    TISTORY_ID = "66683300hd@gmail.com"
    TISTORY_PW = "gmlehd05"
    TISTORY_BLOG_NAME = "stock-empire"
    print("[INFO] Using Remote Backup Credentials for Boss.")
# -----------------------------------------------

if TISTORY_ID:
    print(f"[DEBUG] FINAL CHECK: TISTORY_ID is LOADED (starts with {TISTORY_ID[:2]}...)")
else:
    print("[ERROR] TISTORY_ID is MISSING!")

class TistoryAutoPoster:
    def __init__(self):
        self.driver = None

    def setup_driver(self):
        print("[INFO] Setting up Headless Chrome Driver for Linux...")
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        # Explicit binary location for Google Chrome on Ubuntu
        chrome_bin = "/usr/bin/google-chrome"
        if os.path.exists(chrome_bin):
            options.binary_location = chrome_bin
        
        try:
            # Try to use system chrome/chromedriver first
            self.driver = webdriver.Chrome(options=options)
        except Exception as e:
            print(f"[INFO] System driver failed, trying webdriver-manager: {e}")
            try:
                from webdriver_manager.chrome import ChromeDriverManager
                self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            except Exception as e2:
                print(f"[ERROR] Driver setup failed: {e2}")
                self.driver = None

    def login(self):
        if not self.driver:
            print("[ERROR] Driver is not initialized. Cannot login.")
            return False
            
        # Ensure credentials are valid strings
        user_id = TISTORY_ID or ""
        user_pw = TISTORY_PW or ""
        
        if not user_id or not user_pw:
            print("[ERROR] Missing credentials for login.")
            return False
        
        print(f"[INFO] Logging in to Tistory for {user_id}...")
        try:
            self.driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
                "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
            })
            
            # 카카오 로그인 다이렉트 주소
            self.driver.get("https://accounts.kakao.com/login?continue=https%3A%2F%2Fwww.tistory.com%2Fauth%2Fkakao%2Fredirect")
            time.sleep(3)
            
            try:
                id_field = WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.NAME, "loginId"))
                )
                pw_field = self.driver.find_element(By.NAME, "password")
                
                id_field.send_keys(user_id)
                pw_field.send_keys(user_pw)
                pw_field.send_keys(Keys.ENTER)
                
                # 로그인 완료 대기 (메인 페이지 이동 확인)
                time.sleep(5)
                print("[INFO] Login successful!")
                return True
            except Exception as e:
                print(f"[ERROR] Login interaction failed: {e}")
                self.driver.save_screenshot("login_interaction_error.png")
                return False
        except Exception as e:
            print(f"[ERROR] Overall login sequence failed: {e}")
            return False
        except Exception as e:
            print(f"[ERROR] Login failed: {e}")
            self.driver.save_screenshot("tistory_login_error.png")
            return False

    def post(self, title, content, tags=""):
        print(f"[INFO] Posting to Tistory: {title}")
        try:
            # 글쓰기 페이지 이동
            write_url = f"https://{TISTORY_BLOG_NAME}.tistory.com/manage/post"
            self.driver.get(write_url)
            time.sleep(3)

            # 1. 제목 입력 (더 길게 대기)
            print("[INFO] Waiting for editor to load...")
            try:
                title_input = WebDriverWait(self.driver, 30).until(
                    EC.element_to_be_clickable((By.ID, "title-field"))
                )
            except Exception as e:
                print("[WARN] title-field not clickable, trying fallback selector...")
                title_input = WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='제목'], #title-field"))
                )
            
            title_input.clear()
            title_input.send_keys(title)
            print("[INFO] Title entered.")
            time.sleep(2)
            
            # 2. 태그 입력
            if tags:
                try:
                    tag_input = self.driver.find_element(By.ID, "tag-field")
                    tag_input.send_keys(tags)
                    tag_input.send_keys(Keys.ENTER)
                    time.sleep(1)
                    print("[INFO] Tags entered.")
                except:
                    print("[WARN] Could not find tag-field, skipping tags.")

            # 3. 본문 입력 (에디터 프레임 전환 필요할 수 있음)
            try:
                # 티스토리 신규 에디터는 iframe 구조일 수 있음
                iframes = self.driver.find_elements(By.TAG_NAME, "iframe")
                editor_frame = None
                for frame in iframes:
                    if "editor" in frame.get_attribute("id").lower():
                        editor_frame = frame
                        break
                
                if editor_frame:
                    self.driver.switch_to.frame(editor_frame)
                    print("[INFO] Switched to editor iframe.")

                # 본문 영역 찾기 (contenteditable)
                body_input = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "#tinymce, .CodeMirror, [contenteditable='true']"))
                )
                body_input.click()
                time.sleep(0.5)
                
                # HTML 모드 전환 시도
                self.driver.switch_to.default_content() # 다시 메인으로
                
                # HTML 모드 버튼 찾기 (JS 실행)
                script = """
                    var btn = document.querySelector('#editor-mode-layer-btn-open');
                    if(btn) { 
                        btn.click(); 
                        setTimeout(() => {
                            var htmlBtn = document.querySelector('#editor-mode-html');
                            if(htmlBtn) htmlBtn.click();
                        }, 500);
                        return true;
                    }
                    return false;
                """
                switched = self.driver.execute_script(script)
                time.sleep(1)
                
                # 모드 전환 시 경고창 처리 (작성 모드를 변경하시겠습니까?)
                try:
                    WebDriverWait(self.driver, 3).until(EC.alert_is_present())
                    alert = self.driver.switch_to.alert
                    print(f"[INFO] Accepting alert: {alert.text}")
                    alert.accept()
                    time.sleep(1)
                except:
                    pass # 경고창 없으면 패스

                if switched:
                    print("[INFO] JS Switched to HTML mode.")
                    # JS로 직접 본문 내용 주입
                    safe_content = content.replace("`", "\\`").replace("${", "\\${")
                    self.driver.execute_script(f"""
                        var cm = document.querySelector('.CodeMirror');
                        if(cm && cm.CodeMirror) {{
                            cm.CodeMirror.setValue(`{safe_content}`);
                        }} else {{
                            var editor = document.querySelector('#tinymce');
                            if(editor) editor.innerHTML = `{safe_content}`;
                        }}
                    """)
                else:
                    print("[WARN] HTML mode switch failed. Pasting as text.")
                    # 다시 프레임으로 가야할 수도 있음
                    if editor_frame:
                        self.driver.switch_to.frame(editor_frame)
                    body_input.send_keys(content)

            except Exception as e:
                print(f"[ERROR] Content input failed: {e}")
                self.driver.save_screenshot("tistory_error_content.png")
                return False

            time.sleep(3)

            # 4. 발행 버튼 클릭
            self.driver.switch_to.default_content() # 최종 발행 시에는 메인 컨텐츠로
            print("[INFO] Clicking Publish (Step 1)...")
            try:
                publish_btn = self.driver.find_element(By.ID, "publish-layer-btn")
                publish_btn.click()
                time.sleep(1)
                
                final_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.ID, "publish-btn"))
                )
                final_btn.click()
                print("[SUCCESS] Post published!")
                return True
            except Exception as e:
                print(f"[ERROR] Final publish failed: {e}")
                self.driver.save_screenshot("tistory_error_publish.png")
                return False

        except Exception as e:
            print(f"[ERROR] Posting process failed: {e}")
            return False

    def close(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    # Test
    poster = TistoryAutoPoster()
    poster.setup_driver()
    if poster.login():
        poster.post("자동 포스팅 테스트", "<p>Hello World</p>", "AI,주식")
    poster.close()
