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

# ==============================================================================
# [설정] 티스토리 정보
# ==============================================================================
TISTORY_ID = os.getenv("TISTORY_ID")
TISTORY_PW = os.getenv("TISTORY_PW")
TISTORY_BLOG_NAME = os.getenv("TISTORY_BLOG_NAME")

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
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        except Exception as e:
            print(f"[ERROR] Driver setup failed: {e}")
            # Fallback for Ubuntu
            options.binary_location = "/usr/bin/google-chrome"
            self.driver = webdriver.Chrome(options=options)

    def login(self):
        print("[INFO] Logging in to Tistory...")
        try:
            self.driver.get("https://www.tistory.com/auth/login")
            time.sleep(2)
            
            # 카카오 로그인 버튼 클릭 (일반적으로 카카오 계정 사용)
            kakao_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "btn_login.link_kakao"))
            )
            kakao_btn.click()
            time.sleep(2)
            
            # 아이디/비번 입력
            id_input = WebDriverWait(self.driver, 10).until(EC.presence_of_element_to_be_clickable((By.NAME, "loginId")))
            pw_input = self.driver.find_element(By.NAME, "password")
            
            id_input.send_keys(TISTORY_ID)
            pw_input.send_keys(TISTORY_PW)
            pw_input.send_keys(Keys.ENTER)
            
            time.sleep(5) # 로그인 처리 대기
            print("[INFO] Login sequence completed.")
            return True
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

            # 1. 제목 입력
            title_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_to_be_clickable((By.ID, "title-field"))
            )
            title_input.send_keys(title)
            time.sleep(1)

            # 2. 태그 입력
            if tags:
                tag_input = self.driver.find_element(By.ID, "tag-field")
                tag_input.send_keys(tags)
                tag_input.send_keys(Keys.ENTER)
                time.sleep(1)

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
