@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   FLV 直播流服务器 - 快速启动
echo ========================================
echo.

echo [1/3] 检查 FFmpeg 安装...
where ffmpeg >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 FFmpeg
    echo.
    echo 请先安装 FFmpeg:
    echo   winget install Gyan.FFmpeg
    echo   或
    echo   choco install ffmpeg
    echo.
    pause
    exit /b 1
)
echo ✅ FFmpeg 已安装
echo.

echo [2/3] 检查 Node.js 依赖...
if not exist node_modules (
    echo 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ 依赖已安装
echo.

echo [3/3] 启动流媒体服务器...
echo.
echo 💡 提示：
echo   - 按 Ctrl+C 停止服务
echo   - 播放地址：http://localhost:8000/live/stream.flv
echo   - 前端页面：打开 front\index.html
echo.
echo ========================================
echo.

node server.js

pause
