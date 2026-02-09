import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def capture_v4_perfectly_clean_screenshots():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    mobile_emulation = {
        "deviceMetrics": { "width": 390, "height": 844, "pixelRatio": 3.0 },
        "userAgent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
    }
    chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    base_url = "https://stock-empire.vercel.app"
    
    # 훨씬 강력한 제거 스크립트 (모든 z-index가 높은 고정 배너를 찾아 제거)
    kill_all_popups_js = """
    const killPopups = () => {
        // 1. 특정 텍스트 포함 요소 제거
        const allDivs = document.getElementsByTagName('div');
        for (let div of allDivs) {
            if (div.innerText && (div.innerText.includes('Stock Empire App') || div.innerText.includes('설치하기'))) {
                div.style.display = 'none';
                div.remove();
            }
        }
        // 2. 하단 고정 바 강제 제거 (InstallPWA 의 전형적인 클래스 타겟팅)
        const fixedElements = document.querySelectorAll('.fixed.bottom-24, .fixed.bottom-6');
        fixedElements.forEach(el => el.remove());
    };
    killPopups();
    // 팝업이 나중에 뜰 수도 있으니 0.5초마다 감시
    setInterval(killPopups, 500);
    """

    try:
        print("[INFO] 완벽하게 깨끗한 스크린샷 촬영 준비 중...")

        # 1. 시장
        driver.get(f"{base_url}/market")
        time.sleep(7)
        driver.execute_script(kill_all_popups_js)
        time.sleep(2)
        driver.save_screenshot("screenshot_1_market.png")
        print("[SUCCESS] 1. 시장 (Clean)")

        # 2. 뉴스
        driver.get(f"{base_url}/newsroom")
        time.sleep(7)
        driver.execute_script(kill_all_popups_js)
        time.sleep(2)
        driver.save_screenshot("screenshot_2_news.png")
        print("[SUCCESS] 2. 뉴스 (Clean)")

        # 3. 분석
        driver.get(f"{base_url}/analysis")
        time.sleep(7)
        driver.execute_script(kill_all_popups_js)
        time.sleep(2)
        driver.save_screenshot("screenshot_3_analysis.png")
        print("[SUCCESS] 3. 분석 (Clean)")
        
        print("\n[완료] 이제 진짜 깨끗한 사진 3장이 준비되었습니다!")

    except Exception as e:
        print(f"[ERROR] 오류 발생: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_v4_perfectly_clean_screenshots()
