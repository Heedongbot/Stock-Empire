import subprocess
import time
import sys
import os

def run_process(command, name):
    print(f"[INFO] Starting {name}...")
    return subprocess.Popen(command, shell=True)

def main():
    print("=" * 60)
    print("Stock Empire Automated Intelligence System")
    print("Core Engines: US News & Alpha Signals (VVIP)")
    print("=" * 60)

    # 1. US News Crawler (with Tistory Auto-Posting)
    us_crawler = run_process("python crawler/us_news_crawler.py", "US News Crawler")
    
    # 2. VVIP Alpha Analyzer (Real-time Signal Detection)
    alpha_analyzer = run_process("python crawler/alpha_analyzer.py", "VVIP Alpha Analyzer")
    
    print("\n[SUCCESS] All Engines Launched! 🚀")
    print("The system is now autonomously monitoring the global market.")
    print("Press Ctrl+C to stop all engines.\n")
    
    try:
        while True:
            time.sleep(1)
            # Check if processes are alive
            if us_crawler.poll() is not None:
                print("[WARN] US News Crawler stopped. Restarting...")
                us_crawler = run_process("python crawler/us_news_crawler.py", "US News Crawler")
            
            if alpha_analyzer.poll() is not None:
                print("[WARN] VVIP Alpha Analyzer stopped. Restarting...")
                alpha_analyzer = run_process("python crawler/alpha_analyzer.py", "VVIP Alpha Analyzer")
                
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down all engines...")
        us_crawler.terminate()
        alpha_analyzer.terminate()
        print("[INFO] System offline.")

if __name__ == "__main__":
    main()
