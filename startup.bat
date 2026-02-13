@echo off
REM 这是一个 Windows 批处理脚本，用于快速启动项目
REM 双击运行或在 PowerShell 中运行

echo ========================================
echo   菜单系统启动脚本
echo ========================================
echo.

REM 检查 Node.js
echo 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Node.js 未安装！
    echo 请从 https://nodejs.org 下载安装
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

REM 检查 MongoDB
echo.
echo 检查 MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  警告：MongoDB 未安装或未在 PATH 中
    echo 请确保 MongoDB 正在运行（使用 MongoDB Compass 或 mongod 命令）
    echo 或使用 MongoDB Atlas（云数据库）
) else (
    echo ✅ MongoDB 已安装
)

REM 进入后端目录
echo.
echo 初始化后端...
cd backend
if not exist "node_modules" (
    echo 📦 首次运行，安装依赖...
    call npm install
) else (
    echo ✅ 依赖已安装
)

REM 检查 .env 文件
if not exist ".env" (
    echo 📝 创建 .env 文件...
    copy .env.example .env
    echo ⚠️  请编辑 .env 文件配置数据库连接！
)

REM 启动后端
echo.
echo 🚀 启动后端服务器...
echo 访问: http://localhost:5000/api/health
echo.
start cmd /k "npm start"

REM 启动前端
echo.
echo 🚀 启动前端开发服务器...
cd ..\frontend
timeout /t 3 /nobreak

REM 尝试使用 http-server
echo 检查 http-server...
where http-server >nul 2>&1
if errorlevel 1 (
    echo ℹ️  http-server 未安装，请手动启动前端
    echo 方案 1: 在 VS Code 中使用 Live Server 扩展
    echo 方案 2: 运行 python -m http.server 8000
    echo 方案 3: 运行 npx http-server -p 8000
    pause
) else (
    echo ✅ http-server 已安装
    echo 前端访问: http://localhost:8000
    call http-server -p 8000 -o auth.html
)
