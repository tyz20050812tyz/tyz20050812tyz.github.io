# 菜单系统快速部署指南

## 📋 检查清单

### 1. 环境检查
- [ ] Node.js v14+ 已安装
- [ ] MongoDB 已安装或已有 Atlas 账户
- [ ] 代码编辑器（VS Code）已打开
- [ ] 终端可用

### 2. 数据库配置

#### 本地 MongoDB
1. 安装 MongoDB：https://www.mongodb.com/try/download/community
2. 启动 MongoDB 服务：
   ```bash
   mongod
   ```

#### MongoDB Atlas（云数据库）
1. 访问 https://www.mongodb.com/cloud/atlas
2. 创建免费账户
3. 创建集群
4. 获取连接字符串：`mongodb+srv://user:pass@cluster.mongodb.net/database`

### 3. 后端部署

#### 第一步：初始化后端
```bash
cd backend
npm install
```

#### 第二步：配置环境
1. 复制 `.env.example` 到 `.env`
2. 编辑 `.env`：
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dish-menu
   JWT_SECRET=your_super_secret_key_12345
   NODE_ENV=development
   ```

#### 第三步：启动服务器
```bash
npm start
```

输出应该显示：
```
数据库连接成功
服务器运行在端口 5000
```

#### 验证后端
在浏览器打开：`http://localhost:5000/api/health`
应该看到：`{"status": "Server is running"}`

### 4. 前端部署

#### 方式一：使用 VS Code Live Server
1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键点击 `frontend/index.html`
3. 选择 "Open with Live Server"
4. 浏览器会自动打开应用

#### 方式二：使用 Python 简单服务器
```bash
cd frontend
# Python 3
python -m http.server 8000
# Python 2
python -m SimpleHTTPServer 8000
```

访问：`http://localhost:8000/auth.html`

#### 方式三：使用 Node.js http-server
```bash
npm install -g http-server
cd frontend
http-server -p 8000
```

### 5. 测试应用

1. **打开应用**
   - 访问 `http://localhost:8000/auth.html`（或 Live Server 提供的 URL）

2. **注册新账户**
   - 邮箱：`test@example.com`
   - 用户名：`测试用户`
   - 密码：`123456`

3. **添加测试菜品**
   - 使用 Postman 或 curl 添加菜品
   - 或通过管理员接口

4. **完整流程测试**
   - 浏览菜品
   - 搜索和筛选
   - 添加到购物车
   - 下单
   - 查看订单

## 🍳 添加示例菜品

### 方式一：使用 curl
```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "红烧肉",
    "description": "肥瘦相间，软糯入味",
    "category": "家常菜",
    "price": 45,
    "difficulty": "中等",
    "cookTime": "90分钟",
    "ingredients": ["猪肉", "冰糖", "酱油", "葱", "生姜"],
    "steps": [
      {"order": 1, "description": "猪肉切块，焯水"},
      {"order": 2, "description": "冰糖炒糖色"},
      {"order": 3, "description": "加入肉块翻炒"},
      {"order": 4, "description": "加酱油和水，烧1小时"}
    ]
  }'
```

### 方式二：使用 Postman
1. 创建 POST 请求
2. URL：`http://localhost:5000/api/dishes`
3. Body (JSON)：
```json
{
  "name": "番茄鸡蛋面",
  "description": "清汤番茄鸡蛋面，爽口开胃",
  "category": "面食",
  "price": 25,
  "difficulty": "简单",
  "cookTime": "20分钟",
  "ingredients": ["番茄", "鸡蛋", "面条", "葱"],
  "steps": [
    {"order": 1, "description": "烧水至沸腾"},
    {"order": 2, "description": "番茄切块，鸡蛋打散"},
    {"order": 3, "description": "水烧开后加面条"},
    {"order": 4, "description": "煮3分钟，加番茄和蛋液"}
  ]
}
```

## 🐛 故障排除

### 错误：CORS 错误
**症状**：前端无法连接后端
**解决**：
1. 检查后端是否运行在 5000 端口
2. 检查 `server.js` 是否有 `app.use(cors())`
3. 前端 API URL 是否正确：`http://localhost:5000/api`

### 错误：MongoDB 连接失败
**症状**：`数据库连接失败`
**解决**：
1. 检查 MongoDB 是否运行：`mongod`
2. 如果使用 Atlas，检查连接字符串和 IP 白名单
3. 检查 `.env` 中的 `MONGODB_URI` 是否正确

### 错误：端口已被占用
**症状**：`Error: listen EADDRINUSE :::5000`
**解决**：
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### 注册后无法登录
**症状**：登录显示邮箱或密码错误
**解决**：
1. 检查数据库中用户是否创建成功
2. 确保 JWT_SECRET 在注册和登录时一致
3. 检查浏览器 localStorage 是否保存了 token

## 📱 手机访问

1. 确保手机和电脑在同一网络
2. 获取电脑 IP：
   ```bash
   # Windows
   ipconfig
   # macOS/Linux
   ifconfig
   ```
3. 在手机浏览器访问：`http://YOUR_IP:8000/auth.html`

## 🚀 生产部署

### 后端部署（Heroku 示例）
```bash
# 1. 创建 Procfile
echo "web: node server.js" > Procfile

# 2. 连接 Heroku
heroku create your-app-name
heroku config:set MONGODB_URI=your_atlas_url
heroku config:set JWT_SECRET=your_secret

# 3. 部署
git push heroku main
```

### 前端部署（Netlify 示例）
1. 在 Netlify 上创建新项目
2. 连接 GitHub 仓库
3. 设置构建命令：无（静态文件）
4. 设置发布目录：`frontend`
5. 部署

## 📞 支持

遇到问题？检查以下步骤：
1. 查看浏览器控制台（F12）的错误信息
2. 检查后端日志
3. 确认数据库连接
4. 检查防火墙设置

---

**祝部署顺利！如有问题请查看 README.md**
