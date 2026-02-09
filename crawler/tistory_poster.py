import sys
import io
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

# Force UTF-8 encoding for stdout/stderr to avoid CP949 errors on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
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
        import platform
        is_linux = platform.system() == "Linux"
        
        if is_linux:
            print("[INFO] Setting up Headless Chrome Driver for Linux...")
        else:
            print("[INFO] Setting up GUI Chrome Driver for Windows...")
        
        options = Options()
        
        # 리눅스(서버)에서만 Headless 모드 사용
        if is_linux:
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            chrome_bin = "/usr/bin/google-chrome"
            if os.path.exists(chrome_bin):
                options.binary_location = chrome_bin
        
        # 공통 옵션
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        try:
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
            
        user_id = TISTORY_ID or ""
        user_pw = TISTORY_PW or ""
        
        if not user_id or not user_pw:
            print("[ERROR] Missing credentials for login.")
            return False
        
        print(f"[INFO] Logging in to Tistory (Human-like behavior mode)...")
        try:
            # 0. 완전 초기화 (기존 세션/쿠키 삭제)
            print("[INFO] 0단계: 기존 세션 정리를 위해 로그아웃 및 쿠키 삭제")
            self.driver.delete_all_cookies()
            # 카카오 로그아웃 URL 강제 접속
            self.driver.get("https://accounts.kakao.com/logout?continue=https://www.tistory.com/auth/login")
            time.sleep(2)
            
            # 1. 스텔스 모드 강화 (navigator.webdriver 완벽 제거)
            self.driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
                "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
            })
            
            # 2. 블로그 메인 접속 (자연스러운 유입)
            blog_url = f"https://{TISTORY_BLOG_NAME}.tistory.com"
            print(f"[INFO: TARGET BLOG] {blog_url}")
            print(f"[INFO] 1단계: 블로그 메인 유입")
            self.driver.get(blog_url)
            time.sleep(2)
            
            # 3. 로그인 페이지로 이동 (다이렉트 URL 대신 티스토리 인증 페이지 경유)
            print("[INFO] 2단계: 티스토리 로그인 섹션 시작")
            self.driver.get("https://www.tistory.com/auth/login")
            time.sleep(2)
            
            # --- [추가] 티스토리 로그인 선택 페이지 처리 (카카오 로그인 버튼 클릭) ---
            try:
                kakao_login_btn = self.driver.find_elements(By.CSS_SELECTOR, "a.link_kakao_id, .btn_login")
                if kakao_login_btn and kakao_login_btn[0].is_displayed():
                    print("[INFO] 카카오톡 계정 로그인 버튼 클릭...")
                    self.driver.execute_script("arguments[0].click();", kakao_login_btn[0])
                    time.sleep(2)
            except: pass

            try:
                # 4. 아이디/비번 입력 필드 대기
                id_field = WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.NAME, "loginId"))
                )
                pw_field = self.driver.find_element(By.NAME, "password")
                
                # 5. [중요] 한 땀 한 땀 타이핑 (사람처럼!)
                print(f"[INFO] 3단계: 계정 정보 입력 중... (Typing delay applied)")
                id_field.clear()
                for char in user_id:
                    id_field.send_keys(char)
                    time.sleep(0.1) # 0.1초씩 지연
                
                time.sleep(0.5)
                
                pw_field.clear()
                for char in user_pw:
                    pw_field.send_keys(char)
                    time.sleep(0.1)
                
                time.sleep(1)
                
                # 6. 로그인 버튼 클릭
                try:
                    # [추가] 기기 신뢰 체크박스 처리
                    trust_checkbox = self.driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox'], .lab_check")
                    for chk in trust_checkbox:
                        try:
                            inner = chk.get_attribute("innerText") or ""
                            if "기기" in inner or "신뢰" in inner:
                                self.driver.execute_script("arguments[0].click();", chk)
                        except: pass
                    
                    submit_btn = self.driver.find_element(By.CSS_SELECTOR, ".btn_g.highlight.submit, button[type='submit']")
                    self.driver.execute_script("arguments[0].click();", submit_btn)
                except:
                    pw_field.send_keys(Keys.ENTER)
                
                print("[INFO] 4단계: 인증 정보 제출 완료. 리다이렉트 대기 중...")
                
                # 7. 성공 확인 (로그인 후 티스토리 홈 또는 관리자로 돌아오는지)
                start_time = time.time()
                while time.time() - start_time < 60:
                    curr_url = self.driver.current_url
                    print(f"[DEBUG] Login URL: {curr_url}")
                    
                    # 카카오 보안/확인 페이지 처리
                    if "kakao.com" in curr_url:
                        if "confirm" in curr_url or "security" in curr_url or "selectVerificationMethod" in curr_url:
                            print("[ALERT] 🚨 카카오 인증(2단계) 또는 방법 선택이 필요한 상황입니다!")
                            
                            # [추가] 인증 방법 버튼 소탕 (카톡으로 인증하기 등)
                            try:
                                # 다양한 인증 버튼 셀렉터 (리스트 아이콘, 버튼 등)
                                choice_btns = self.driver.find_elements(By.CSS_SELECTOR, "button.btn_choice, .link_choice, .choice_item, ul.list_choice li button")
                                for btn in choice_btns:
                                    if btn.is_displayed():
                                        print(f"[INFO] 인증 방법 선택 버튼 클릭: {btn.text or 'Auth Method'}")
                                        self.driver.execute_script("arguments[0].click();", btn)
                                        time.sleep(3)
                            except: pass

                            print("[ALERT] 대표님 핸드폰 카카오톡 메시지를 확인하시고 '예, 제가 로그인했습니다'를 눌러주세요!")
                            self.driver.save_screenshot("kakao_verification_needed.png")
                        
                        try:
                            # '확인' 또는 '계속하기' 버튼 찾기
                            cont_btns = self.driver.find_elements(By.XPATH, "//button[contains(text(),'계속') or contains(text(),'확인') or contains(text(),'동의') or contains(text(),'허용')]")
                            for btn in cont_btns:
                                if btn.is_displayed():
                                    print(f"[INFO] 카카오 리다이렉트 버튼 클릭: {btn.text}")
                                    self.driver.execute_script("arguments[0].click();", btn)
                                    time.sleep(2)
                        except: pass
                    
                    # 로그인 성공 상태 확인
                    if "tistory.com" in curr_url and "auth/login" not in curr_url and "kakao.com" not in curr_url:
                        print(f"[SUCCESS] 로그인 검증 성공! (현재 URL: {curr_url})")
                        time.sleep(3) # 안정화를 위해 조금 더 대기
                        return True
                    
                    time.sleep(3)
                
                print("[WARN] 자동 리다이렉트 감지 실패. 최종 세션 체크 중...")
                self.driver.get(f"https://{TISTORY_BLOG_NAME}.tistory.com/manage/posts")
                time.sleep(5)
                if "auth/login" not in self.driver.current_url:
                    print("[SUCCESS] 최종 세션 확인 완료!")
                    return True
                else:
                    self.driver.save_screenshot("login_failure_final.png")
                    return False

            except Exception as e:
                print(f"[ERROR] Interaction error: {e}")
                self.driver.save_screenshot("login_error_capture.png")
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
            write_url = f"https://{TISTORY_BLOG_NAME}.tistory.com/manage/newpost"
            print(f"[INFO] Navigating to: {write_url}")
            
            # Ensure driver is ready
            if not self.driver:
                print("[INFO] Auto-initializing driver for post...")
                self.setup_driver()
                if not self.login():
                    print("[ERROR] Failed to login during auto-init. Aborting post.")
                    return False

            self.driver.get(write_url)
            time.sleep(5)
            
            # 튕겼는지 확인 (로그인 페이지로 리다이렉트 된 경우)
            if "auth/login" in self.driver.current_url:
                print("[WARN] Session lost or not synced. Retrying login sequence...")
                self.login()
                self.driver.get(write_url)
                time.sleep(5)

            print(f"[INFO] Current URL: {self.driver.current_url}")

            # 1. 제목 입력 (팝업 처리 포함)
            print("[INFO] Clearing potential blocking layers...")
            
            # 혹시 모를 팝업/모달 전방위 소탕 (KR 텍스트 포함)
            try:
                # 1) 일반적인 닫기 버튼
                popups = self.driver.find_elements(By.CSS_SELECTOR, ".btn_close, .close, .modal-close, button[class*='close']")
                # 2) 텍스트 기반 닫기/확인 버튼 (XPATH)
                text_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), '닫기') or contains(text(), '확인') or contains(text(), '다음') or contains(text(), '동의')]")
                
                for btn in (popups + text_buttons):
                    if btn.is_displayed():
                        print(f"[INFO] Clicking blocking element: {btn.text or 'Popup'}")
                        self.driver.execute_script("arguments[0].click();", btn)
                        time.sleep(1)
            except: pass

            print("[INFO] Attempting to find Title input...")
            try:
                # 1. 표준 ID 시도
                title_input = WebDriverWait(self.driver, 15).until(
                    EC.element_to_be_clickable((By.ID, "title-field"))
                )
            except:
                print("[WARN] title-field not clickable, trying JS fallback...")
                # JS로 강제 검색 및 포커스
                js_title_finder = """
                    var selectors = ["#title-field", "input[placeholder*='제목']", ".textarea_tit", "#tx_article_title"];
                    for(var s of selectors) {
                        var el = document.querySelector(s);
                        if(el) {
                            el.focus();
                            return el;
                        }
                    }
                    return null;
                """
                title_input = self.driver.execute_script(js_title_finder)
                
                if not title_input:
                    print("[ERROR] Title input not found by all means. Saving source...")
                    self.driver.save_screenshot("post_error_final.png")
                    with open("post_error_source.html", "w", encoding="utf-8") as f:
                        f.write(self.driver.page_source)
                    return False
            
            # 제목 입력
            self.driver.execute_script("arguments[0].value = '';", title_input)
            title_input.send_keys(title)
            print("[INFO] Title entered successfully.")
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
                    # JS로 직접 본문 내용 주입 (강력한 동기화 포함)
                    safe_content = content.replace("`", "\\`").replace("${", "\\${")
                    injection_script = f"""
                        function inject() {{
                            // 1. CodeMirror (HTML 모드) 처리
                            var cm = document.querySelector('.CodeMirror');
                            if(cm && cm.CodeMirror) {{
                                cm.CodeMirror.setValue(`{safe_content}`);
                                cm.CodeMirror.save(); // 기본 textarea로 동기화
                            }}
                            
                            // 2. TinyMCE (기본 에디터) 처리
                            if (window.tinymce && tinymce.activeEditor) {{
                                tinymce.activeEditor.setContent(`{safe_content}`);
                                tinymce.activeEditor.save();
                            }}

                            // 3. 강제 데이터 처리 이벤트 발생
                            var event = new Event('change', {{ bubbles: true }});
                            var textarea = document.querySelector('textarea.editor-textarea');
                            if(textarea) {{
                                textarea.value = `{safe_content}`;
                                textarea.dispatchEvent(event);
                            }}
                            
                            return true;
                        }}
                        return inject();
                    """
                    self.driver.execute_script(injection_script)
                    time.sleep(2)
                else:
                    print("[WARN] HTML mode switch failed. Trying basic injection.")
                    if editor_frame:
                        self.driver.switch_to.frame(editor_frame)
                    body_input.send_keys(content)
                
                # 다시 기본 모드로 전환 시도 (저장 트리거를 위해)
                self.driver.switch_to.default_content()
                self.driver.execute_script("var btn = document.querySelector('#editor-mode-layer-btn-open'); if(btn) btn.click();")
                time.sleep(0.5)
                self.driver.execute_script("var basicBtn = document.querySelector('#editor-mode-basic'); if(basicBtn) basicBtn.click();")
                time.sleep(2)

            except Exception as e:
                print(f"[ERROR] Content input failed: {e}")
                self.driver.save_screenshot("tistory_error_content.png")
                return False

            time.sleep(3)

            # 4. 발행 버튼 클릭 (2단계)
            self.driver.switch_to.default_content()
            print("[INFO] Clicking Publish (Step 1: Open Layer)...")
            try:
                # Step 1: 발행 레이어 열기
                try:
                    publish_btn = WebDriverWait(self.driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "publish-layer-btn"))
                    )
                    self.driver.execute_script("arguments[0].click();", publish_btn)
                except:
                    # JS 폴백
                    self.driver.execute_script("document.getElementById('publish-layer-btn').click();")
                
                time.sleep(2)
                print("[INFO] Publish layer opened. Step 2: Click final publish...")
                
                # Step 2: 최종 발행 버튼 클릭
                try:
                    final_btn = WebDriverWait(self.driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "publish-btn"))
                    )
                    self.driver.execute_script("arguments[0].click();", final_btn)
                except:
                    # JS 폴백
                    self.driver.execute_script("document.getElementById('publish-btn').click();")
                
                time.sleep(3)
                print("[SUCCESS] Post published! Check your blog!")
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
    import requests
    import json
    from datetime import datetime
    
    HISTORY_FILE = "posted_news_history.json"
    
    def load_history():
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except:
                return []
        return []

    def save_history(history):
        try:
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(history[-100:], f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[ERROR] Failed to save history: {e}")

    print(f"[INFO] 정식 리포트 포스팅 시작: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # 서버에서 최신 뉴스 가져오기
    try:
        res = requests.get("https://stock-empire.vercel.app/us-news-realtime.json", timeout=10)
        news_list = res.json() if res.status_code == 200 else []
    except:
        news_list = []
    
    if not news_list:
        print("[WARN] 뉴스가 없습니다!")
    else:
        # 중복 체크를 위한 히스토리 로드
        history = load_history()
        
        # 아직 포스팅 되지 않은 최신 뉴스 찾기
        target_news = None
        for news in news_list:
            news_id = news.get('link') or news.get('title')
            if news_id not in history:
                target_news = news
                break
        
        if not target_news:
            print("[INFO] 새로운 뉴스가 없습니다. 이미 모든 뉴스가 포스팅되었습니다.")
        else:
            news = target_news
            
            # 데이터 추출 (구조화된 JSON 대응)
            free_data = news.get('free_tier', {})
            vip_data = news.get('vip_tier', {})
            ai_data = vip_data.get('ai_analysis', {})
            
            title_text = free_data.get('title', news.get('title', '미장 실시간 속보'))
            summary_main = free_data.get('summary_kr', news.get('summary_kr', '내용 요약 중...'))
            insight = ai_data.get('summary_kr', 'AI가 시장 상황을 정밀 분석 중입니다.')
            score = ai_data.get('impact_score', 70)
            sentiment = news.get('sentiment', 'NEUTRAL')
            source = free_data.get('original_source', news.get('source', 'Stock Empire AI'))
            
            # 시장 풍향 한글화
            sentiment_kr = "상승 (BULLISH)" if sentiment.upper() == "BULLISH" else "하락 (BEARISH)" if sentiment.upper() == "BEARISH" else "중립 (NEUTRAL)"
            
            title = f"[Stock Empire] {title_text}"
            now_str = datetime.now().strftime('%Y년 %m월 %d일 %H:%M')
            
            # --- 대표님이 원하시는 '프리미엄 코부장 스타일' 템플릿 ---
            content = f"""
<div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto;">
    
    <!-- 섹션 1: 메인 헤더 -->
    <h2 style="font-size: 22px; color: #111; border-bottom: 3px solid #3366ff; padding-bottom: 8px; margin-bottom: 20px;">
        us 미국 증시 AI 속보
    </h2>
    
    <p style="font-size: 15px; color: #555; margin-bottom: 20px;">
        <strong>Stock Empire AI</strong>가 실시간으로 포착한 미국 시장 핵심 뉴스입니다.
    </p>

    <!-- 요약 박스 -->
    <div style="background-color: #f0f7ff; border: 1px solid #cce5ff; padding: 20px; border-radius: 10px; margin-bottom: 30px; position: relative;">
        <div style="font-size: 18px; font-weight: bold; color: #004085; line-height: 1.4;">
            <span style="font-size: 24px; vertical-align: middle; margin-right: 8px;">📋</span> {title_text}
        </div>
    </div>

    <p style="font-size: 16px; color: #444; margin-bottom: 35px; line-height: 1.8;">
        {summary_main}
    </p>

    <!-- 섹션 2: AI 워룸 분석 카드 -->
    <div style="background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 15px; padding: 25px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); margin-bottom: 40px;">
        <h3 style="margin-top: 0; font-size: 19px; color: #2d3436; display: flex; align-items: center;">
            <span style="margin-right: 10px;">🤖</span> AI 워룸(War Room) 분석
        </h3>
        
        <div style="margin: 20px 0; padding: 15px; border-top: 1px dashed #eee; border-bottom: 1px dashed #eee;">
            <div style="margin-bottom: 10px; font-size: 16px;">
                <strong>⚡ 파급력 점수:</strong> <span style="color: #d63031; font-weight: bold;">{score}/100</span>
            </div>
            <div style="font-size: 16px;">
                <strong>🧭 시장 풍향:</strong> <span style="color: #0984e3; font-weight: bold;">{sentiment_kr}</span>
            </div>
        </div>

        <div style="font-size: 16px; color: #2d3436;">
            <strong>💡 코부장 Insight:</strong>
            <div style="background-color: #fdfdfd; padding: 15px; border-left: 4px solid #fab1a0; margin-top: 10px; font-style: italic; color: #636e72;">
                "{insight}"
            </div>
        </div>
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">

    <!-- 섹션 3: 하단 CTA 배너 -->
    <div style="background: linear-gradient(135deg, #2d3436 0%, #000000 100%); padding: 35px 20px; border-radius: 15px; text-align: center; color: white;">
        <div style="font-size: 19px; font-weight: bold; margin-bottom: 15px;">
            🚀 아직도 뉴스를 직접 찾으시나요?
        </div>
        <p style="font-size: 14px; opacity: 0.8; margin-bottom: 25px;">
            Stock Empire에서는 전 세계 금융 뉴스를 AI가 24시간 실시간으로 분석해 드립니다.<br>
            지금 바로 접속해서 나만의 AI 투자 비서를 만나보세요.
        </p>
        <a href="https://stock-empire.vercel.app" style="background-color: #3498db; color: white; padding: 12px 35px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; transition: background 0.3s;">
            👉 Stock Empire 무료 사용하기
        </a>
    </div>

    <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
        ※ 본 포스팅은 Stock Empire AI 엔진에 의해 자동 생성되었습니다.
    </p>
</div>
            """
            
            tags = "미국주식,미장속보,주식투자,AI분석,재테크"
            
            poster = TistoryAutoPoster()
            poster.setup_driver()
            if poster.login():
                print("[INFO] 본문 주입 및 포스팅 시도...")
                if poster.post(title, content, tags):
                    # 성공 시 히스토리에 추가
                    history.append(news_id)
                    save_history(history)
                    print("[SUCCESS] 히스토리에 기록되었습니다.")
            poster.close()
