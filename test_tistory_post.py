
from crawler.tistory_poster import TistoryAutoPoster
import time

def test_post():
    poster = TistoryAutoPoster()
    poster.setup_driver()
    
    if poster.login():
        print("[TEST] Login success. Starting clean post test...")
        title = "[TEST] 코다리 제목 유지 테스트"
        content = "<p>이것은 코다리가 제목이 날아가는지 확인하는 테스트입니다.</p><p>본문 입력 후 제목이 살아있는지 확인하세요.</p>"
        tags = "테스트,자동화,코다리"
        
        poster.post(title, content, tags)
        print("[TEST] Check the browser window now!")
        # 10분 대기 (확인용)
        time.sleep(600)
    
    poster.close()

if __name__ == "__main__":
    test_post()
