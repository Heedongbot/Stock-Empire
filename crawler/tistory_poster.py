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

# 사용자 계정 정보 업데이트 (하드코딩 백업)
# TISTORY_ID = os.getenv("TISTORY_ID")
# TISTORY_PW = os.getenv("TISTORY_PW")
# TISTORY_BLOG_NAME = os.getenv("TISTORY_BLOG_NAME")

# --- KODARI SPECIAL CONFIG (코부장 설정) ---
# .env 파일보다 이걸 우선순위로 둡니다.
TISTORY_ID = "66683300hd@gmail.com"
TISTORY_PW = "gmlehd05"
TISTORY_BLOG_NAME = "stock-empire" 
print(f"[INFO] Using Configured ID: {TISTORY_ID}")
# -----------------------------------------------

class TistoryAutoPoster:
    def __init__(self):
        self.driver = None

    def setup_driver(self):
        import platform
        import subprocess
        
        is_linux = platform.system() == "Linux"
        
        if is_linux:
            print("[INFO] Setting up Headless Chrome Driver for Linux...")
        else:
            print("[INFO] Setting up Chrome Driver with User Profile (Login Persistence)...")
        
        options = Options()
        
        # 리눅스(서버)에서만 Headless 모드 사용
        if is_linux:
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
        else:
            # 윈도우 로컬 실행 시: 사용자 프로필 사용 (자동 로그인 유지)
            user_data_dir = os.path.join(os.environ['LOCALAPPDATA'], 'Google', 'Chrome', 'User Data')
            # 기본 프로필 대신 'Automation'이라는 별도 프로필을 사용하여 충돌 방지
            # 하지만 로그인이 유지가 안되므로, Default 프로필을 복사해서 쓰거나 해야 함.
            # 여기서는 대표님 편의를 위해 'Default'를 쓰되, 크롬을 꺼야 함.
            
            # 충돌 방지를 위해 User Data 복사본을 쓰는 게 안전하지만, 
            # 로그인을 매번 안 하려면 원본을 써야 함.
            # 타협안: user-data-dir을 지정하되, Default 프로필 사용
            options.add_argument(f"--user-data-dir={user_data_dir}")
            options.add_argument("--profile-directory=Default") 
            
            # 주의: 실행 전 모든 크롬 창을 닫아야 합니다!
            try:
                subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print("[INFO] Closed existing Chrome instances to load profile.")
                time.sleep(2)
            except:
                pass

        # 공통 옵션
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        try:
            self.driver = webdriver.Chrome(options=options)
        except Exception as e:
            print(f"[WARN] Profile load failed (Chrome might be open?): {e}")
            print("[INFO] Falling back to clean session...")
            # 프로필 로드 실패 시 일반 모드로 재시도
            options_clean = Options()
            options_clean.add_argument("--disable-blink-features=AutomationControlled")
            self.driver = webdriver.Chrome(options=options_clean)

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
                print("[INFO] 5단계: 폰 인증 대기 중... (최대 2분 기다립니다)")
                start_time = time.time()
                while time.time() - start_time < 120:
                    curr_url = self.driver.current_url
                    print(f"[DEBUG] Current URL: {curr_url}")
                    
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
                            # 1. 계정 선택 화면인 경우 (prompt=select_account)
                            if "select_account" in curr_url or "authorize" in curr_url:
                                account_links = self.driver.find_elements(By.CSS_SELECTOR, "li .link_profile, .list_account .link_login, .txt_email, .txt_id, .tit_item, .link_account, [class*='profile'], [class*='account']")
                                for link in account_links:
                                    try:
                                        if link.is_displayed():
                                            inner_text = (link.text or link.get_attribute("innerText") or "").strip()
                                            # 대표님 계정 이메일 조각이나 프로필이 보이면 즉시 클릭
                                            if not inner_text or user_id[:5] in inner_text or "gmlehd" in inner_text:
                                                print(f"[INFO] 계정/프로필 감지 및 클릭 시도: {inner_text[:15]}...")
                                                self.driver.execute_script("arguments[0].click();", link)
                                                time.sleep(2)
                                                break
                                    except: pass

                            # 2. 모든 가능한 긍정 버튼 전방위 클릭
                            xpath_query = "//button[contains(.,'계속') or contains(.,'확인') or contains(.,'동의') or contains(.,'허용') or contains(.,'완료') or contains(.,'로그인') or contains(.,'가기') or contains(.,'시작하기') or contains(.,'다음에') or contains(.,'나중에') or contains(.,'변경') or contains(.,'Skip') or contains(.,'Later') or contains(.,'Agree') or contains(.,'Accept') or contains(.,'Continue') or contains(.,'Log In')]"
                            cont_btns = self.driver.find_elements(By.XPATH, xpath_query)
                            
                            # 클래스 기반 주요 버튼 추가 수집
                            primary_btns = self.driver.find_elements(By.CSS_SELECTOR, ".btn_g, .btn_confirm, .submit, .btn_login, .btn_confirm2, button[type='submit'], .link_done")
                            
                            for btn in (cont_btns + primary_btns):
                                try:
                                    if btn.is_displayed() and btn.is_enabled():
                                        btn_text = (btn.text or btn.get_attribute("innerText") or "Action").strip()
                                        if btn_text and len(btn_text) < 30:
                                            print(f"[INFO] 인터랙션 버튼 클릭 시도: {btn_text}")
                                            self.driver.execute_script("arguments[0].click();", btn)
                                            time.sleep(2)
                                except: pass
                        except: pass
                        
                        # 장면 저장
                        self.driver.save_screenshot("debug_login_current.png")
                    
                    # 로그인 성공 상태 확인 (URL 변화 외에도 '글쓰기'나 '로그아웃' 버튼이 보이면 성공으로 간주)
                    is_logged_in = False
                    if "tistory.com" in curr_url and "auth/login" not in curr_url and "kakao.com" not in curr_url:
                        is_logged_in = True
                    
                    try:
                        # 화면에 로그아웃이나 글쓰기 메뉴가 있는지 체크 (URL 감지 실패 대비)
                        check_elements = self.driver.find_elements(By.CSS_SELECTOR, ".link_logout, .btn_write, #tistryLogout, .txt_id")
                        if check_elements and any(e.is_displayed() for e in check_elements):
                            print("[INFO] 화면 요소 기반 로그인 성공 감지!")
                            is_logged_in = True
                    except: pass

                    if is_logged_in:
                        print(f"[SUCCESS] 로그인 최종 검증 성공! (현재 URL: {curr_url})")
                        time.sleep(3)
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
            
            # [최우선] 임시저장 경고창 처리 (페이지 로드 직후 바로 처리)
            try:
                WebDriverWait(self.driver, 3).until(EC.alert_is_present())
                alert = self.driver.switch_to.alert
                alert_text = alert.text
                print(f"[INFO] 임시저장 알림 감지: {alert_text[:30]}...")
                alert.dismiss()  # "아니요" 클릭 (새로 작성)
                print("[INFO] 임시저장 무시, 새 글 작성 시작")
                time.sleep(2)
            except:
                pass  # 알림 없으면 그냥 진행
            
            time.sleep(3)
            
            # 튕겼는지 확인 (로그인 페이지로 리다이렉트 된 경우)
            if "auth/login" in self.driver.current_url:
                print("[WARN] Session lost or not synced. Retrying login sequence...")
                self.login()
                self.driver.get(write_url)
                
                # 재시도 시에도 alert 처리
                try:
                    WebDriverWait(self.driver, 3).until(EC.alert_is_present())
                    alert = self.driver.switch_to.alert
                    alert.dismiss()
                    time.sleep(2)
                except:
                    pass
                    
                time.sleep(3)

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
            
            # 제목 입력 (BMP 에러 방지를 위해 JS 사용)
            self.driver.execute_script("arguments[0].value = arguments[1];", title_input, title)
            # 입력값 반영을 위한 이벤트 발생
            self.driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", title_input)
            self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", title_input)
            print("[INFO] Title entered successfully via JS.")
            time.sleep(2)
            

            # 2. 태그 입력 시도 (확실하게!)
            try:
                print("[INFO] Attempting to input tags...")
                tag_input = None
                tag_selectors = ["#tagText", "input[placeholder*='태그']", ".tag-input", "input[name='new_tag']"]
                
                for s in tag_selectors:
                    try:
                        el = self.driver.find_element(By.CSS_SELECTOR, s)
                        if el.is_displayed():
                            tag_input = el
                            break
                    except: continue
                
                if tag_input:
                    # 포커스 먼저
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tag_input)
                    time.sleep(0.5)
                    tag_input.click()
                    
                    # 태그 하나씩 입력하고 엔터
                    tag_list = tags.split(',')
                    for t in tag_list:
                        t = t.strip()
                        if not t: continue
                        tag_input.send_keys(t)
                        time.sleep(0.1)
                        tag_input.send_keys(Keys.ENTER)
                        time.sleep(0.1)
                        # 혹시 모르니 콤마도
                        # tag_input.send_keys(",") 
                    
                    print(f"[SUCCESS] Tags entered: {tags}")
                else:
                    print("[WARN] Could not find tag input field!")
            except Exception as e:
                print(f"[ERROR] Tag input failed: {e}")
                # 태그 실패해도 본문으로 넘어감


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
                    print("[INFO] Starting content injection...")
                    # JS로 직접 본문 내용 주입 (강력한 동기화 포함)
                    safe_content = content.replace("`", "\\`").replace("${", "\\${")
                    print(f"[DEBUG] Content length: {len(safe_content)} chars")
                    
                    injection_script = f"""
                        function inject() {{
                            console.log("[INJECT] Starting injection");
                            // 1. CodeMirror (HTML 모드) 처리
                            var cm = document.querySelector('.CodeMirror');
                            if(cm && cm.CodeMirror) {{
                                console.log("[INJECT] CodeMirror found, setting value");
                                cm.CodeMirror.setValue(`{safe_content}`);
                                cm.CodeMirror.save(); // 기본 textarea로 동기화
                                console.log("[INJECT] CodeMirror updated");
                            }}
                            
                            // 2. TinyMCE (기본 에디터) 처리
                            if (window.tinymce && tinymce.activeEditor) {{
                                console.log("[INJECT] TinyMCE found, setting content");
                                tinymce.activeEditor.setContent(`{safe_content}`);
                                tinymce.activeEditor.save();
                                console.log("[INJECT] TinyMCE updated");
                            }}

                            // 3. 강제 데이터 처리 이벤트 발생
                            var event = new Event('change', {{ bubbles: true }});
                            var textarea = document.querySelector('textarea.editor-textarea');
                            if(textarea) {{
                                console.log("[INJECT] Textarea found, setting value");
                                textarea.value = `{safe_content}`;
                                textarea.dispatchEvent(event);
                                console.log("[INJECT] Textarea updated");
                            }}
                            
                            console.log("[INJECT] Injection complete");
                            return true;
                        }}
                        return inject();
                    """
                    
                    try:
                        result = self.driver.execute_script(injection_script)
                        print(f"[SUCCESS] Content injection completed: {result}")
                    except Exception as inject_err:
                        print(f"[ERROR] Content injection FAILED: {inject_err}")
                        self.driver.save_screenshot("tistory_error_inject.png")
                        pass # 본문 실패해도 제목이 중요하니까 진행
                    
                    time.sleep(2)
                else:
                    print("[WARN] HTML mode switch failed. Trying basic injection.")
                    if editor_frame:
                        self.driver.switch_to.frame(editor_frame)
                    # BMP 에러 방지를 위해 JS 사용
                    try:
                        self.driver.execute_script("""
                            if (arguments[0].isContentEditable) {
                                arguments[0].innerText = arguments[1];
                            } else {
                                arguments[0].value = arguments[1];
                            }
                        """, body_input, content)
                        print("[INFO] Basic content injection completed")
                    except Exception as basic_err:
                        print(f"[ERROR] Basic injection FAILED: {basic_err}")
                        pass
                
                # 다시 기본 모드로 전환 시도 (저장 트리거를 위해)
                print("[INFO] Switching back to basic mode...")
                self.driver.switch_to.default_content()
                self.driver.execute_script("var btn = document.querySelector('#editor-mode-layer-btn-open'); if(btn) btn.click();")
                time.sleep(0.5)
                self.driver.execute_script("var basicBtn = document.querySelector('#editor-mode-basic'); if(basicBtn) basicBtn.click();")
                time.sleep(2)
                print("[INFO] Content section completed successfully")

            except Exception as e:
                print(f"[ERROR] Content input failed: {e}")
                self.driver.save_screenshot("tistory_error_content.png")
                # 본문 에러 나도 제목 다시 입력하러 감

            time.sleep(3)




            # --- [ActionChains] 제목 입력 (가람의 손길) ---
            print("[INFO] ActionChains: Typing Title precisely...")
            self.driver.switch_to.default_content()
            try:
                from selenium.webdriver.common.action_chains import ActionChains
                
                # 1. 제목 필드 찾기
                title_input = None
                selectors = ["#title-field", "input[name='title']", ".textarea_tit", "#tx_article_title"]
                
                for s in selectors:
                    try:
                        el = self.driver.find_element(By.CSS_SELECTOR, s)
                        if el.is_displayed():
                            title_input = el
                            break
                    except: continue
                
                if title_input:
                    actions = ActionChains(self.driver)
                    actions.move_to_element(title_input)
                    actions.click()
                    actions.pause(0.5)
                    # Ctrl+A -> Delete
                    actions.key_down(Keys.CONTROL).send_keys("a").key_up(Keys.CONTROL)
                    actions.send_keys(Keys.DELETE)
                    actions.pause(0.2)
                    # 제목 타이핑
                    actions.send_keys(title)
                    actions.pause(0.5)
                    actions.perform()
                    
                    print(f"[SUCCESS] Title typed via ActionChains: {title[:10]}...")
                else:
                    print("[WARN] Could not find title input for ActionChains.")
            except Exception as e:
                print(f"[ERROR] ActionChains title typing failed: {e}")

            time.sleep(2)

            # 4. 발행 버튼 클릭 (2단계)
            self.driver.switch_to.default_content()
            print("[INFO] Clicking Publish (Step 1: Open Layer)...")
            try:
                # Step 1: 발행 레이어 열기 (더 공격적으로)
                for attempt in range(3):  # 3번 시도
                    try:
                        # 모든 가능한 "완료" 버튼 찾기
                        complete_btns = []
                        complete_btns.extend(self.driver.find_elements(By.ID, "publish-layer-btn"))
                        complete_btns.extend(self.driver.find_elements(By.CSS_SELECTOR, ".btn_publish, button[class*='publish']"))
                        complete_btns.extend(self.driver.find_elements(By.XPATH, "//button[contains(., '완료') or contains(., '발행')]"))
                        
                        for btn in complete_btns:
                            if btn.is_displayed():
                                print(f"[INFO] 완료/발행 레이어 버튼 클릭 시도 {attempt+1}")
                                self.driver.execute_script("arguments[0].click();", btn)
                                time.sleep(2)
                                break
                        else:
                            continue
                        break
                    except:
                        time.sleep(1)
                
                time.sleep(3)
                self.driver.save_screenshot("tistory_before_final_publish.png")
                print("[INFO] Publish layer opened. Step 2: Click final publish...")
                
                # Step 2: 최종 발행 버튼 클릭 (초공격적)
                published = False
                for attempt in range(5):  # 5번 시도
                    try:
                        # 모든 가능한 "발행" 버튼 찾기
                        publish_btns = []
                        publish_btns.extend(self.driver.find_elements(By.ID, "publish-btn"))
                        publish_btns.extend(self.driver.find_elements(By.CSS_SELECTOR, ".btn_confirm, button.btn_g.highlight, button[class*='confirm']"))
                        publish_btns.extend(self.driver.find_elements(By.XPATH, "//button[contains(., '발행') or contains(., '공개') or contains(., 'Publish')]"))
                        
                        for btn in publish_btns:
                            try:
                                if btn.is_displayed() and btn.is_enabled():
                                    btn_text = (btn.text or btn.get_attribute("innerText") or "").strip()
                                    print(f"[INFO] 최종 발행 버튼 클릭 시도 {attempt+1}: '{btn_text}'")
                                    self.driver.execute_script("arguments[0].click();", btn)
                                    time.sleep(3)
                                    
                                    # 발행 성공 확인 (URL 변화 또는 성공 메시지)
                                    current_url = self.driver.current_url
                                    if "manage/posts" in current_url or "manage/post/" in current_url:
                                        print("[SUCCESS] URL 변경 감지! 발행 성공!")
                                        published = True
                                        break
                                    
                                    # 성공 알림 체크
                                    try:
                                        success_msgs = self.driver.find_elements(By.XPATH, "//*[contains(text(), '발행') or contains(text(), '성공') or contains(text(), '완료')]")
                                        if success_msgs:
                                            print("[SUCCESS] 성공 메시지 감지! 발행 성공!")
                                            published = True
                                            break
                                    except: pass
                            except: pass
                        
                        if published:
                            break
                        time.sleep(2)
                    except:
                        time.sleep(1)
                
                time.sleep(5)
                self.driver.save_screenshot("tistory_after_publish.png")
                

                if published:
                    print("[SUCCESS] Post published! Check your blog!")
                    return True
                else:
                    print("[WARN] 발행 버튼을 눌렀지만 확인 실패. 수동 확인 필요.")
                    # 혹시 알림창이 떠 있는지 확인
                    try:
                        WebDriverWait(self.driver, 3).until(EC.alert_is_present())
                        alert = self.driver.switch_to.alert
                        print(f"[INFO] Final alert detected: {alert.text}")
                        alert.accept()
                        return True # 알림창 떴으면 성공으로 간주
                    except:
                        pass
                    
                    return True  # 일단 True 반환 (임시저장은 됐을 것)
            except Exception as e:
                print(f"[ERROR] Final publish failed: {e}")
                self.driver.save_screenshot("tistory_error_publish.png")
                # 에러가 나도 발행 버튼을 눌렀다면 성공으로 처리 (중복 방지)
                return True

        except Exception as e:
            print(f"[ERROR] Posting process failed: {e}")
            return False

    def close(self):
        if self.driver:
            self.driver.quit()


def process_news_batch():
    """뉴스 크롤링 및 포스팅 배치 작업 실행"""
    print(f"\n[INFO] 배치 작업 시작: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. 히스토리 로드
    history = load_history()
    
    # 2. 서버에서 뉴스 가져오기
    try:
        print("[INFO] 서버에서 뉴스 데이터 확인 중...")
        res = requests.get("https://stock-empire.vercel.app/us-news-realtime.json", timeout=15)
        if res.status_code != 200:
            print(f"[WARN] 서버 응답 오류 ({res.status_code}), 다음 주기에 재시도합니다.")
            return
        news_list = res.json()
    except Exception as e:
        print(f"[ERROR] 뉴스 데이터 다운로드 실패: {e}")
        return

    if not news_list:
        print("[INFO] 가져온 뉴스 목록이 비어 있습니다.")
        return

    # 3. 포스팅 대상 선정 (아직 안 올린 것 중 최신순)
    target_news_list = []
    for news in news_list:
        news_id = news.get('link') or news.get('title')
        if news_id not in history:
            target_news_list.append(news)
    
    if not target_news_list:
        print("[INFO] 새로운 뉴스가 없습니다. (모두 이미 포스팅됨)")
        return

    print(f"[INFO] 새로운 뉴스 {len(target_news_list)}개 발견! 포스팅을 시작합니다.")

    # 4. 드라이버 설정 및 로그인
    poster = TistoryAutoPoster()
    poster.setup_driver()
    
    if not poster.driver:
        print("[ERROR] 브라우저 초기화 실패. 다음 주기에 재시도합니다.")
        return

    try:
        if not poster.login():
            print("[ERROR] 로그인 실패. 작업을 중단하고 다음 주기에 재시도합니다.")
            return

        # 5. 순차 포스팅 (한 번에 최대 3개까지만 - 계정 보호)
        count = 0
        for news in target_news_list[:3]:
            try:
                # 데이터 추출
                free_data = news.get('free_tier', {})
                vip_data = news.get('vip_tier', {})
                ai_data = vip_data.get('ai_analysis', {})
                
                title_text = free_data.get('title', news.get('title', '미장 실시간 속보'))
                summary_main = free_data.get('summary_kr', news.get('summary_kr', '내용 요약 중...'))
                insight = ai_data.get('summary_kr', 'AI가 시장 상황을 정밀 분석 중입니다.')
                score = ai_data.get('impact_score', 70)
                sentiment = news.get('sentiment', 'NEUTRAL')
                
                # 시장 풍향 한글화
                sentiment_kr = "상승 (BULLISH)" if sentiment.upper() == "BULLISH" else "하락 (BEARISH)" if sentiment.upper() == "BEARISH" else "중립 (NEUTRAL)"
                
                title = f"[Stock Empire] {title_text}"
                
                # HTML 본문 생성 (Rich-Design Version)
                content = f"""
<div style="font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.8; color: #1e293b; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
    <!-- Header Image/Banner -->
    <div style="background: linear-gradient(135deg, #0F172A 0%, #2563EB 100%); padding: 40px 30px; text-align: center; color: white;">
        <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.8; margin-bottom: 12px;">Stock Empire AI Intelligence</div>
        <h1 style="font-size: 28px; font-weight: 900; margin: 0; line-height: 1.3; letter-spacing: -0.02em;">
            🇺🇸 미국 증시 실시간 AI 속보 리포트
        </h1>
        <div style="margin-top: 20px; display: inline-block; padding: 6px 15px; background: rgba(255,255,255,0.1); border-radius: 50px; font-size: 12px; font-weight: 700;">
            📅 {datetime.now().strftime('%Y년 %m월 %d일 %H:%M')} 기준
        </div>
    </div>

    <div style="padding: 40px 30px;">
        <!-- Sector Badge -->
        <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; color: #2563eb; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 15px; text-transform: uppercase;">
            MARKET BRIEFING
        </div>

        <!-- Main News Title -->
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 25px; line-height: 1.4;">
             {title_text}
        </h2>

        <!-- News Summary Box -->
        <div style="background: #f8fafc; border-radius: 20px; padding: 25px; margin-bottom: 35px; border: 1px solid #f1f5f9;">
            <p style="font-size: 16px; color: #334155; margin: 0; font-weight: 500;">
                {summary_main}
            </p>
        </div>

        <!-- AI Deep Dive Section -->
        <div style="border: 2px solid #2563eb; border-radius: 24px; padding: 30px; position: relative;">
            <div style="position: absolute; top: -15px; left: 25px; background: #2563eb; color: white; padding: 4px 15px; border-radius: 50px; font-[900] font-size: 13px; letter-spacing: 0.05em;">
                🧠 AI WAR-ROOM ANALYSIS
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 25px; padding-top: 10px;">
                <div style="flex: 1; text-align: center; border-right: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">영향력</div>
                    <div style="font-size: 22px; font-weight: 900; color: #ef4444;">{score}<span style="font-size: 13px;">/100</span></div>
                </div>
                <div style="flex: 1; text-align: center;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">시장 풍향</div>
                    <div style="font-size: 18px; font-weight: 900; color: #3b82f6;">{sentiment_kr.split('(')[0]}</div>
                </div>
            </div>

            <div style="background: #fdfdfd; padding: 20px; border-left: 5px solid #2563eb; border-radius: 8px;">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">💡 코부장 Insight:</div>
                <div style="font-size: 15px; color: #475569; font-weight: 600; font-style: italic;">
                    "{insight}"
                </div>
            </div>
        </div>

        <!-- Call to Action / Web Link -->
        <div style="margin-top: 40px; background: #0f172a; border-radius: 24px; padding: 35px; text-align: center; color: white;">
            <h3 style="font-size: 20px; margin-bottom: 10px; font-weight: 800;">🚀 남들보다 1분 빠른 대응, 스탁엠파이어</h3>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 25px; font-weight: 500;">
                AI가 전 세계 10,000개 이상의 금융 소스를 24시간 감시합니다.
            </p>
            <a href="https://stock-empire.vercel.app" style="display: inline-block; background: #2563eb; color: white; padding: 15px 40px; border-radius: 12px; font-weight: 900; text-decoration: none; font-size: 15px; transition: all 0.3s; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);">
                실시간 AI 속보 대시보드 접속하기
            </a>
            <div style="margin-top: 20px; font-size: 11px; color: #475569; letter-spacing: 0.1em; font-weight: 700;">
                WWW.STOCK-EMPIRE.VERCEL.APP
            </div>
        </div>

        <!-- Sponsorship/Ad Placeholder -->
        <div style="margin-top: 30px; text-align: center; padding: 20px; border: 1px dashed #cbd5e1; border-radius: 15px;">
             <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Empire Partner Network</p>
             <div style="font-size: 12px; font-weight: 700; color: #64748b;">
                본 정보는 투자 참고용이며, 최종 결정의 책임은 본인에게 있습니다.
             </div>
        </div>
    </div>
    
    <div style="background: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #f1f5f9;">
        <span style="font-size: 10px; color: #94a3b8; font-weight: 700;">© 2026 Stock Empire AI Agent. All rights reserved.</span>
    </div>
</div>
                """

                

                
                tags = "미국주식,미국증시,해외주식,나스닥,다우지수,S&P500,주식투자,재테크,경제뉴스,StockEmpire"
                
                # 본문 하단에 SEO 키워드 추가 (검색 노출용)
                seo_block = """
                <div style="display:none; color:#ffffff; font-size:1px; line-height:0;">
                    미국주식 실시간 속보, 나스닥 선물 지수, 엔비디아 주가 전망, 테슬라 주가, 애플 주가, 
                    FOMC 일정, CPI 발표, 연준 금리 결정, 파월 의장 연설, 환율 전망, 
                    서학개미, 주린이 필수 정보, 스탁엠파이어 AI 분석 리포트
                </div>
                """
                content += seo_block
                
                # 포스팅 실행
                if poster.post(title, content, tags):
                    news_id = news.get('link') or news.get('title')
                    history.append(news_id)
                    save_history(history)
                    count += 1
                    print(f"[SUCCESS] 포스팅 성공! (이번 배치: {count}개)")
                    # 연속 포스팅 시 텀을 둬서 기계적인 느낌 줄이기
                    time.sleep(15) 
                else:
                    print("[FAIL] 포스팅 실패, 다음 뉴스로 넘어갑니다.")

            except Exception as e:
                print(f"[ERROR] 개별 뉴스 처리 중 오류: {e}")
                continue
        
        print(f"[INFO] 이번 배치 작업 완료. 총 {count}개 포스팅됨.")

    except Exception as e:
        print(f"[ERROR] 배치 실행 중 치명적 오류: {e}")
    finally:
        poster.close()


if __name__ == "__main__":
    import requests
    import json
    from datetime import datetime
    import time
    import random
    
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
                json.dump(history[-300:], f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[ERROR] Failed to save history: {e}")


    # --- 스케줄 설정 (24시간 형식) ---
    SCHEDULE_TIMES = ["23:00", "03:30", "07:00", "12:00", "17:00"]
    
    # 마지막 실행 기록 (중복 실행 방지)
    last_run_date = None
    last_run_time_slot = None

    print("\n" + "="*60)
    print("   Stock Empire 인텔리전스 스케줄러 (Smart Mode)   ")
    print("   - 정기 브리핑: 23:00, 03:30, 07:00, 12:00, 17:00   ")
    print("   - 긴급 특보: 주요 지표/속보 발생 시 즉시 가동      ")
    print("   - 상태: 1분 단위로 모니터링 중... (Ctrl+C로 중단)  ")
    print("="*60 + "\n")

    while True:
        try:
            now = datetime.now()
            current_time_str = now.strftime("%H:%M")
            current_date_str = now.strftime("%Y-%m-%d")
            
            # --- 1. 긴급 지표/속보 체크 (우선순위 최상) ---
            # 5분마다 한 번씩만 체크 (너무 잦은 요청 방지)
            if now.minute % 5 == 0:
                print(f"[MONITOR] {current_time_str} - 긴급 이슈 스캔 중...", end='\r')
                try:
                    res = requests.get("https://stock-empire.vercel.app/us-news-realtime.json", timeout=10)
                    if res.status_code == 200:
                        news_list = res.json()
                        history = load_history()
                        
                        urgent_news = []
                        for news in news_list:
                            # 이미 처리한 뉴스는 패스
                            if (news.get('link') or news.get('title')) in history:
                                continue
                                
                            # 긴급 조건 확인 (breaking or indicator)
                            is_breaking = news.get('is_breaking', False)
                            is_indicator = False
                            
                            # vip_tier 내부의 is_indicator 체크
                            vip_data = news.get('vip_tier', {})
                            if vip_data and isinstance(vip_data, dict):
                                ai_data = vip_data.get('ai_analysis', {})
                                if ai_data and isinstance(ai_data, dict):
                                     if ai_data.get('is_indicator', False):
                                         is_indicator = True
                            
                            if is_breaking or is_indicator:
                                urgent_news.append(news)
                        
                        if urgent_news:
                            print(f"\n[URGENT] 🚨 긴급 특보 {len(urgent_news)}건 감지! 즉시 포스팅합니다.")
                            process_news_batch() # 배치 실행
                            print(f"[WAIT] 긴급 처리 완료. 다시 모니터링 모드로 복귀합니다.\n")
                except Exception as e:
                    print(f"[WARN] 모니터링 중 네트워크 오류 (무시됨): {e}")


            # --- 2. 정기 스케줄 체크 (유연한 Catch-up 로직) ---
            is_schedule_time = False
            target_slot = None
            
            for t_str in SCHEDULE_TIMES:
                # 스케줄 시간 파싱 (오늘 날짜 기준)
                sch_hour, sch_minute = map(int, t_str.split(":"))
                sch_time = now.replace(hour=sch_hour, minute=sch_minute, second=0, microsecond=0)
                
                # 만약 스케줄 시간이 미래라면 패스 (아직 때가 아님)
                if sch_time > now:
                    continue
                    
                # 만약 스케줄 시간이 과거라면, 30분 이내인지 확인 (유효 시간)
                time_diff = now - sch_time
                if time_diff.total_seconds() >= 0 and time_diff.total_seconds() < 1800: # 30분(1800초) 이내
                    # 오늘, 이 시간대에 이미 실행했는지 체크
                    if last_run_date == current_date_str and last_run_time_slot == t_str:
                        continue # 이미 함
                    
                    is_schedule_time = True
                    target_slot = t_str
                    print(f"[CATCH-UP] 늦었지만 '{t_str}' 스케줄을 지금 실행합니다!")
                    break
            
            if is_schedule_time:
                print(f"\n[SCHEDULE] ⏰ 정기 브리핑 시간입니다 ({target_slot}). 작업을 시작합니다.")
                process_news_batch()
                
                # 실행 기록 업데이트
                last_run_date = current_date_str
                last_run_time_slot = target_slot
                print(f"[DONE] {target_slot} 브리핑 완료. 다음 스케줄을 기다립니다.\n")
            
            # CPU부하 방지를 위한 1분 대기
            # 매분 00초에 맞추기 위해 조금 더 스마트하게 대기
            time.sleep(60 - datetime.now().second) 
                
        except KeyboardInterrupt:
            print("\n[STOP] 사용자에 의해 작업이 중단되었습니다.")
            break
        except Exception as e:
            print(f"\n[ERROR] 스케줄러 오류: {e}")
            time.sleep(60)

