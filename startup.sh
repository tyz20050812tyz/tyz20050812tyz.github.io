#!/bin/bash
# Linux/Mac 启动脚本

echo "========================================"
echo "  菜单系统启动脚本"
echo "========================================"
echo ""

# 检查 Node.js
echo "检查 Node.js 安装..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误：Node.js 未安装！"
    echo "请从 https://nodejs.org 下载安装"
    exit 1
fi
echo "✅ Node.js 已安装"
node --version

# 检查 MongoDB
echo ""
echo "检查 MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  警告：MongoDB 未安装"
    echo "请确保 MongoDB 正在运行或使用 MongoDB Atlas"
else
    echo "✅ MongoDB 已安装"
    mongod --version
fi

# 进入后端目录
echo ""
echo "初始化后端..."
cd backend || exit 1

if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置数据库连接！"
fi

# 启动后端
echo ""
echo "🚀 启动后端服务器..."
echo "访问: http://localhost:5000/api/health"
echo ""

# 后台运行后端
npm start &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
echo ""
echo "🚀 启动前端开发服务器..."
cd ../frontend || exit 1

if command -v http-server &> /dev/null; then
    echo "✅ http-server 已安装"
    echo "前端访问: http://localhost:8000"
    http-server -p 8000 -o auth.html
else
    echo "ℹ️  http-server 未安装"
    echo "使用 Python 启动："
    python3 -m http.server 8000
fi
