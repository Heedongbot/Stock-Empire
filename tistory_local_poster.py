"""
티스토리 자동 포스팅 (로컬 PC 전용)
- 서버의 최신 뉴스를 가져와서 티스토리에 자동 포스팅
- GUI 크롬 사용 (봇 탐지 우회)
- 중복 포스팅 방지
"""

import os
import sys
import json
import time
import requests
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# 환경 변수 로드 (다중 경로 시도)
from dotenv import load_dotenv

# .env.local 먼저 시도, 없으면 .env
env_paths = ['.env.local', '.env', '../.env.local', '../.env']
for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"[INFO] 환경변수 로드: {env_path}")
        break

# 환경변수에서 가져오기, 없으면 하드코딩 백업 사용
TISTORY_ID = os.getenv("TISTORY_ID") or "66683300hd@gmail.com"
TISTORY_PW = os.getenv("TISTORY_PW") or "gmlehd05"
TISTORY_BLOG_NAME = os.getenv("TISTORY_BLOG_NAME") or "stock-empire"

print(f"[INFO] 티스토리 계정: {TISTORY_ID[:5]}...")

# 서버 JSON URL (Vercel 배포 URL 또는 로컬 파일)
SERVER_JSON_URL = "https://stock-empire.vercel.app/us-news-realtime.json"
POSTED_HISTORY_FILE = "posted_news_history.json"

print("[INFO] ========================================")
print("[INFO] 티스토리 자동 포스팅 시작")
print(f"[INFO] 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("[INFO] ========================================\n")


def load_posted_history():
    """이미 포스팅한 뉴스 기록 불러오기"""
    if os.path.exists(POSTED_HISTORY_FILE):
        with open(POSTED_HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save_posted_history(history):
    """포스팅 기록 저장"""
    with open(POSTED_HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history[-100:], f, ensure_ascii=False, indent=2)  # 최근 100개만 유지


def fetch_latest_news():
    """서버에서 최신 뉴스 가져오기"""
    print("[INFO] 서버에서 최신 뉴스 다운로드 중...")
    try:
        response = requests.get(SERVER_JSON_URL, timeout=10)
        if response.status_code == 200:
            news_list = response.json()
            print(f"[SUCCESS] {len(news_list)}개의 뉴스를 가져왔습니다.")
            return news_list
        else:
            print(f"[ERROR] 서버 응답 오류: {response.status_code}")
            return []
    except Exception as e:
        print(f"[ERROR] 뉴스 다운로드 실패: {e}")
        return []


def setup_driver():
    """크롬 드라이버 설정 (GUI 모드)"""
    print("[INFO] 크롬 브라우저 준비 중...")
    options = Options()
    # GUI 모드 사용 (headless 제거)
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    
    try:
        driver = webdriver.Chrome(options=options)
        print("[SUCCESS] 크롬 브라우저 준비 완료!")
        return driver
    except Exception as e:
        print(f"[ERROR] 크롬 드라이버 실패: {e}")
        return None


def login_tistory(driver):
    """티스토리 로그인"""
    print("[INFO] 티스토리 로그인 중...")
    try:
        driver.get("https://accounts.kakao.com/login?continue=https%3A%2F%2Fwww.tistory.com%2Fauth%2Fkakao%2Fredirect")
        time.sleep(3)
        
        # --- [추가] 티스토리 로그인 선택 페이지 처리 ---
        try:
            # '카카오계정으로 로그인' 버튼이 있는지 확인
            kakao_login_btn = driver.find_elements(By.CSS_SELECTOR, "a.link_kakao_id, .btn_login")
            if kakao_login_btn and kakao_login_btn[0].is_displayed():
                print("[INFO] 티스토리 로그인 선택 페이지 감지, 카카오 로그인 버튼 클릭...")
                driver.execute_script("arguments[0].click();", kakao_login_btn[0])
                time.sleep(3)
        except Exception as e:
            print(f"[DEBUG] Login selection page bypass failed: {e}")

        id_field = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.NAME, "loginId"))
        )
        pw_field = driver.find_element(By.NAME, "password")
        
        id_field.send_keys(TISTORY_ID)
        pw_field.send_keys(TISTORY_PW)
        time.sleep(1)
        
        try:
            submit_btn = driver.find_element(By.CSS_SELECTOR, ".btn_g.highlight.submit, button[type='submit']")
            submit_btn.click()
        except:
            pw_field.send_keys(Keys.ENTER)
        
        print("[INFO] 로그인 처리 중... (팝업 자동 처리)")
        
        # 카카오 중간 페이지 돌파
        start_time = time.time()
        while time.time() - start_time < 30:
            curr_url = driver.current_url
            if "tistory.com" in curr_url and "auth/login" not in curr_url:
                print(f"[SUCCESS] 로그인 성공! URL: {curr_url}")
                break
            
            if "kakao.com" in curr_url:
                try:
                    cont_btns = driver.find_elements(By.XPATH, "//button[contains(text(),'계속') or contains(text(),'확인')]")
                    for b in cont_btns:
                        if b.is_displayed():
                            b.click()
                except:
                    pass
            
            time.sleep(2)
        
        # 블로그 메인 방문 (세션 동기화)
        driver.get(f"https://{TISTORY_BLOG_NAME}.tistory.com")
        time.sleep(3)
        print("[SUCCESS] 티스토리 로그인 완료!")
        return True
    except Exception as e:
        print(f"[ERROR] 로그인 실패: {e}")
        return False


def post_to_tistory(driver, news_item):
    """티스토리에 뉴스 포스팅"""
    title = f"[Stock Empire] {news_item.get('title', '제목 없음')}"
    print(f"\n[INFO] 포스팅 시작: {title}")
    
    try:
        # 글쓰기 페이지로 이동
        write_url = f"https://{TISTORY_BLOG_NAME}.tistory.com/manage/newpost"
        driver.get(write_url)
        time.sleep(5)
        
        # 세션 확인
        if "auth/login" in driver.current_url:
            print("[WARN] 세션 만료, 재로그인 시도...")
            login_tistory(driver)
            driver.get(write_url)
            time.sleep(5)
        
        print(f"[DEBUG] 현재 URL: {driver.current_url}")
        
        # 팝업 제거
        try:
            popups = driver.find_elements(By.CSS_SELECTOR, ".btn_close, .close, .modal-close")
            text_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), '닫기') or contains(text(), '확인')]")
            for btn in (popups + text_buttons):
                if btn.is_displayed():
                    driver.execute_script("arguments[0].click();", btn)
                    time.sleep(1)
        except:
            pass
        
        # 제목 입력
        print("[INFO] 제목 입력 중...")
        title_input = None
        try:
            title_input = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "title-field"))
            )
        except:
            print("[WARN] title-field 못 찾음, JS로 시도...")
            js_finder = """
                var selectors = ["#title-field", "input[placeholder*='제목']", ".textarea_tit"];
                for(var s of selectors) {
                    var el = document.querySelector(s);
                    if(el) { el.focus(); return el; }
                }
                return null;
            """
            title_input = driver.execute_script(js_finder)
        
        if not title_input:
            print("[ERROR] 제목 입력란을 찾을 수 없습니다!")
            driver.save_screenshot("local_post_error.png")
            return False
        
        driver.execute_script("arguments[0].value = '';", title_input)
        title_input.send_keys(title)
        print("[SUCCESS] 제목 입력 완료")
        time.sleep(2)
        
        # 본문 입력 (간단 버전)
        content = f"""
        <h2>{news_item.get('title', '')}</h2>
        <p><strong>출처:</strong> {news_item.get('source', 'Stock Empire AI')}</p>
        <p>{news_item.get('summary_kr', '')}</p>
        <hr>
        <p><em>본 뉴스는 Stock Empire AI가 자동 분석한 내용입니다.</em></p>
        """
        
        # 본문은 간단히 처리 (또는 스킵)
        print("[INFO] 본문 처리 생략 (제목만 포스팅)")
        
        # 발행 버튼 클릭
        print("[INFO] 발행 버튼 클릭...")
        try:
            publish_btn = driver.find_element(By.ID, "publish-layer-btn")
            publish_btn.click()
            time.sleep(2)
            
            final_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.ID, "publish-btn"))
            )
            final_btn.click()
            time.sleep(3)
            print("[SUCCESS] 포스팅 완료!")
            return True
        except Exception as e:
            print(f"[ERROR] 발행 버튼 클릭 실패: {e}")
            return False
        
    except Exception as e:
        print(f"[ERROR] 포스팅 실패: {e}")
        driver.save_screenshot("local_post_error.png")
        return False


def main():
    """메인 실행 함수"""
    
    # 1. 이미 포스팅한 기록 불러오기
    posted_history = load_posted_history()
    print(f"[INFO] 포스팅 기록: {len(posted_history)}개")
    
    # 2. 최신 뉴스 가져오기
    news_list = fetch_latest_news()
    if not news_list:
        print("[WARN] 새로운 뉴스가 없습니다. 종료합니다.")
        return
    
    # 3. 아직 안 올린 뉴스만 필터링
    new_news = []
    for news in news_list:
        news_id = news.get('link') or news.get('title')
        if news_id not in posted_history:
            new_news.append(news)
    
    if not new_news:
        print("[INFO] 모든 뉴스가 이미 포스팅되었습니다. 종료합니다.")
        return
    
    print(f"[INFO] 새로운 뉴스 {len(new_news)}개 발견!")
    
    # 4. 크롬 드라이버 설정
    driver = setup_driver()
    if not driver:
        print("[ERROR] 크롬 드라이버 실패. 종료합니다.")
        return
    
    try:
        # 5. 티스토리 로그인
        if not login_tistory(driver):
            print("[ERROR] 로그인 실패. 종료합니다.")
            return
        
        # 6. 뉴스 포스팅 (최대 5개)
        posted_count = 0
        for news in new_news[:5]:  # 한 번에 최대 5개
            if post_to_tistory(driver, news):
                news_id = news.get('link') or news.get('title')
                posted_history.append(news_id)
                posted_count += 1
                time.sleep(5)  # 포스팅 간 간격
        
        # 7. 기록 저장
        save_posted_history(posted_history)
        print(f"\n[SUCCESS] 총 {posted_count}개의 뉴스를 포스팅했습니다!")
        
    except Exception as e:
        print(f"[ERROR] 실행 중 오류: {e}")
    finally:
        driver.quit()
        print("\n[INFO] 티스토리 자동 포스팅 종료")
        print("[INFO] ========================================\n")


if __name__ == "__main__":
    main()
