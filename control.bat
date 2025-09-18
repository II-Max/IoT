@echo off
chcp 65001 >nul
title IoT Server Controller
echo.
echo ========================================
echo    🚀 IOT SERVER CONTROL CENTER
echo ========================================
echo.

:menu
cls
echo.
echo ========================================
echo    🎯 IOT SERVER CONTROL PANEL
echo ========================================
echo.
echo 1. 🚀 Start Server
echo 2. 🛑 Stop Server  
echo 3. 🔄 Restart Server
echo 4. 📊 Check Status
echo 5. ❌ Exit
echo.
set /p choice="Choose option [1-5]: "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto stop_server
if "%choice%"=="3" goto restart_server
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto exit
goto menu

:start_server
echo.
echo 📍 Starting IoT Server...
echo 🌐 URL: http://localhost:3000
echo 💡 Press Ctrl+C in the new window to stop
echo.
REM Mở cửa sổ mới để chạy server, cửa sổ hiện tại vẫn mở
start "IoT Server" cmd /k "cd /d C:\Users\Phamv\Desktop\IoT && node mock-iot-server.js"
goto menu

:stop_server
echo.
echo 🛑 Stopping IoT Server...
REM Tìm và kill process Node.js trên port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo 🔍 Killing process PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)
REM Đảm bảo kill tất cả node processes
taskkill /f /im node.exe >nul 2>&1
echo ✅ Server stopped successfully!
timeout /t 2 /nobreak >nul
goto menu

:restart_server
echo.
echo 🔄 Restarting IoT Server...
call :stop_server
timeout /t 3 /nobreak >nul
call :start_server
goto menu

:check_status
echo.
echo 📊 Checking server status...
REM Kiểm tra xem port 3000 có đang listen không
netstat -aon | findstr :3000 >nul
if errorlevel 1 (
    echo ❌ Server is NOT running
) else (
    echo ✅ Server is RUNNING on port 3000
    netstat -aon | findstr :3000
)
echo.
pause
goto menu

:exit
echo.
echo 👋 Goodbye!
timeout /t 1 /nobreak >nul
exit