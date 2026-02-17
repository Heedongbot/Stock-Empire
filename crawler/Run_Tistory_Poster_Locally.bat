@echo off
title Stock Empire Tistory Poster
cd /d "%~dp0"

echo [1/3] 파이썬 설치 확인 중...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 파이썬이 설치되어 있지 않습니다.
    pause
    exit
)

echo [2/3] 필요한 라이브러리 확인 중...
pip install selenium webdriver-manager requests python-dotenv >nul 2>&1

echo [3/3] 프로그램 시작...
echo.
echo ==============================================
echo   티스토리 자동 포스팅 엔진을 시작합니까?
echo   (크롬 창이 모두 닫힙니다)
echo ==============================================
set /p choice="실행하시려면 Y를 입력하세요: "

if /i "%choice%"=="Y" (
    python tistory_poster.py
) else (
    echo 작업을 취소했습니다.
)

pause
