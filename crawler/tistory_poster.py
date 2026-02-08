from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import pyperclip
import os

# ==============================================================================
# [설정] 티스토리 정보
# ==============================================================================
TISTORY_ID = "66683300hd@gmail.com"
TISTORY_PW = "gmlehd05"
BLOG_URL = "https://stock-empire.tistory.com"
CHROME_BINARY_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
# ==============================================================================

class TistoryAutoPoster:
    def __init__(self):
        self.driver = None

    def setup_driver(self):
        print("[INFO] Setting up Chrome Driver...")
        options = Options()
        if os.path.exists(CHROME_BINARY_PATH):
            options.binary_location = CHROME_BINARY_PATH
            print(f"[INFO] Using Chrome binary at: {CHROME_BINARY_PATH}")
        
        options.add_argument("--start-maximized")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        # options.add_argument("--headless") # 디버깅을 위해 headless 끔

        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    def login(self):
        if not self.driver: self.setup_driver()
        
        print(f"[INFO] Logging in with {TISTORY_ID}...")
        self.driver.get("https://www.tistory.com/auth/login")
        time.sleep(2)
        
        try:
            # 1. '카카오계정으로 로그인' 버튼 클릭 (노란 버튼)
            try:
                kakao_login_btn = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, ".link_kakao_id, .btn_login"))
                )
                kakao_login_btn.click()
                print("[INFO] Clicked 'Login with Kakao' button.")
            except:
                print("[INFO] Direct login page or button not found.")

            # 2. 카카오 로그인 폼 입력
            id_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "loginId"))
            )
            id_input.clear()
            id_input.send_keys(TISTORY_ID)
            
            pw_input = self.driver.find_element(By.NAME, "password")
            pw_input.clear()
            pw_input.send_keys(TISTORY_PW)
            pw_input.send_keys(Keys.ENTER)
            
            # 3. 로그인 완료 대기 (URL 변화 확인)
            print("[INFO] Waiting for login completion...")
            WebDriverWait(self.driver, 30).until(
                lambda d: "auth/login" not in d.current_url and "kakao.com" not in d.current_url
            )
            
            # 메인 페이지 로딩 대기
            time.sleep(3)
            print(f"[SUCCESS] Login successful! Current URL: {self.driver.current_url}")
            return True

        except Exception as e:
            print(f"[ERROR] Login failed: {e}")
            self.driver.save_screenshot("tistory_login_fail.png")
            return False

    def post(self, title, content, tags=[]):
        if not self.driver: 
            if not self.login(): return False

        print("[INFO] Navigating to Write page...")
        write_url = f"{BLOG_URL}/manage/newpost"
        self.driver.get(write_url)
        time.sleep(5)
        
        try:
            # 1. 팝업 닫기 (혹시 있으면)
            try:
                close_btn = self.driver.find_element(By.CSS_SELECTOR, ".tit_layer .btn_close")
                if close_btn.is_displayed():
                    close_btn.click()
            except: pass

            # 2. 제목 입력
            print("[INFO] Writing Title...")
            title_input = None
            try:
                # 여러 셀렉터 시도
                selectors = [(By.ID, "post-title-inp"), (By.CSS_SELECTOR, "textarea[placeholder='제목을 입력하세요']")]
                for by, val in selectors:
                    try:
                        title_input = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((by, val)))
                        break
                    except: continue
                
                if title_input:
                    title_input.click()
                    time.sleep(0.5)
                    pyperclip.copy(title)
                    webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()
                else:
                    raise Exception("Title input not found")
            except Exception as e:
                print(f"[ERROR] Title input failed: {e}")
                self.driver.save_screenshot("tistory_error_title.png")
                return False

            time.sleep(1)

            # 3. 본문 입력 (기본 모드에서 붙여넣기 전략)
            print("[INFO] Writing Content...")
            try:
                # iframe 전환 시도 (티스토리 구형/신형 에디터 대응)
                frames = self.driver.find_elements(By.TAG_NAME, "iframe")
                editor_frame = None
                for frame in frames:
                    if "editor" in frame.get_attribute("id") or "editor" in frame.get_attribute("src"):
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
                
                # 내용 붙여넣기
                pyperclip.copy(content) # HTML 태그가 그대로 들어갈 수 있음. (텍스트로)
                # HTML 모드 전환이 안되면 텍스트로 들어가므로, 
                # 이번엔 HTML 모드 전환 버튼을 JS로 강제 클릭 시도
                
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
                    
                    # HTML 모드에서는 textarea나 CodeMirror에 포커스를 줘야 함
                    # JS로 포커스 강제
                    self.driver.execute_script("var cm = document.querySelector('.CodeMirror'); if(cm && cm.CodeMirror) cm.CodeMirror.focus();")
                    time.sleep(0.5)

                    webdriver.ActionChains(self.driver).send_keys(Keys.END).perform() # 맨 뒤로
                    time.sleep(0.5)
                    webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()
                else:
                    print("[WARN] HTML mode switch failed. Pasting as text.")
                    body_input.click()
                    webdriver.ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(Keys.CONTROL).perform()

            except Exception as e:
                print(f"[ERROR] Content input failed: {e}")
                self.driver.save_screenshot("tistory_error_content.png")
                return False

            time.sleep(3)

            # 4. 발행 버튼 클릭
            print("[INFO] Clicking Publish (Step 1)...")
            try:
                # '완료' 버튼 (ID: publish-layer-btn)
                done_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.ID, "publish-layer-btn"))
                )
                done_btn.click()
                print("[INFO] Clicked 'Done' button.")
                time.sleep(2)
                
                # 최종 '발행' 버튼 (레이어 팝업 내)
                print("[INFO] Clicking Final Publish (Step 2)...")
                
                # 팝업 내 발행 버튼 찾기 (보통 button[type='submit'] 또는 .btn_apply)
                final_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "#publish-btn, button[type='submit'], .btn_apply"))
                )
                
                # 공개 설정 라디오 버튼 (공개)
                try:
                    public_radio = self.driver.find_element(By.ID, "open20") 
                    if public_radio: public_radio.click()
                except: pass
                
                final_btn.click()
                print("[SUCCESS] Posted successfully!")
                return True
                
            except Exception as e:
                # 버튼을 못 찾으면 스크린샷
                print(f"[ERROR] Publish button click failed: {e}")
                self.driver.save_screenshot("tistory_error_publish.png")
                return False

        except Exception as e:
            print(f"[ERROR] General error: {e}")
            return False

if __name__ == "__main__":
    poster = TistoryAutoPoster()
    # 테스트용
    poster.post(
        title="[테스트] Stock Empire 자동 포스팅 테스트",
        content="<p>이것은 <strong>Stock Empire</strong> 봇이 작성한 자동 포스팅입니다.</p><p>티스토리 크롤링 성공!</p>"
    )
