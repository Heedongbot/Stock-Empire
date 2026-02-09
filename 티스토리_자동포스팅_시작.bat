@echo off
cd /d "%~dp0"
echo ========================================================
echo   Stock Empire Tistory Auto Poster (24h Mode)
echo ========================================================
echo.
echo [INFO] Activating virtual environment...
echo.

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo [ERROR] venv not found. Trying global python...
)

echo [INFO] Starting Auto Poster Bot...
echo [INFO] This window must stay OPEN for the bot to check news.
echo [INFO] You can minimize this window.
echo.

python crawler/tistory_poster.py

pause
