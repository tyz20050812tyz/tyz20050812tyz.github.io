# 🚀 项目启动检查清单

## ✅ 前置准备

- [ ] Node.js 已安装（检查：`node --version`）
- [ ] MongoDB 已安装或 Atlas 账户已创建
- [ ] VS Code 已打开项目文件夹
- [ ] 终端可用

## 📍 文件结构验证

运行以下命令验证项目结构：

```bash
# Windows PowerShell
Get-ChildItem -Path d:\个人网站 -Recurse | Select-Object FullName

# Linux/Mac
find d:/个人网站 -type f -name "*.js" -o -name "*.html" -o -name "*.json"
```

应该看到：
```
frontend/
  ├── index.html
  ├── auth.html
  ├── css/style.css
  └── js/
      ├── api.js
      ├── auth.js
      ├── cart.js
      ├── main.js
      └── ui.js

backend/
  ├── server.js
  ├── package.json
  ├── .env.example
  ├── models/
  │   ├── Dish.js
  │   ├── Order.js
  │   └── User.js
  └── routes/
      ├── dishes.js
      ├── orders.js
      └── users.js

README.md
SETUP.md
PROJECT_SUMMARY.md
```

## 🔧 第一次运行（完整步骤）

### 步骤 1: 初始化后端

```bash
# 进入后端目录
cd d:\个人网站\backend

# 查看当前目录
pwd  # Linux/Mac
cd   # Windows (显示当前路径)

# 安装依赖
npm install

# 如果遇到 npm 错误，尝试清除缓存
npm cache clean --force
npm install --legacy-peer-deps
```

✅ 预期输出：`added xxx packages`

### 步骤 2: 配置环境变量

```bash
# 在 backend 目录下
# 复制示例文件
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

编辑 `.env` 文件：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dish-menu
JWT_SECRET=my-secret-key-change-this-in-production
NODE_ENV=development
```

⚠️ **重要**：为 JWT_SECRET 使用强随机字符串！例如：
```
JWT_SECRET=aB3$xK9@pL2#mN4&vQ7*wR5%tY8!uZ1^cD6(sE9)fG0
```

### 步骤 3: 启动 MongoDB

#### 选项 A: 本地 MongoDB
```bash
# 确保已安装 MongoDB
# Windows: MongoDB Compass 已启动
# 或在另一个终端运行
mongod

# 验证连接
mongo  # 进入 MongoDB shell
# 输入: exit  退出
```

#### 选项 B: MongoDB Atlas（云数据库）
1. 访问 https://www.mongodb.com/cloud/atlas
2. 创建免费账户
3. 创建集群
4. 获取连接字符串，替换 `.env` 中的 `MONGODB_URI`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dish-menu?retryWrites=true&w=majority
```

### 步骤 4: 启动后端服务器

```bash
# 在 backend 目录下
npm start

# 输出应该显示：
# 数据库连接成功
# 服务器运行在端口 5000
```

✅ **验证后端**：打开浏览器访问 `http://localhost:5000/api/health`
- 应该看到：`{"status":"Server is running"}`

### 步骤 5: 启动前端

打开新的终端窗口，不要关闭后端终端！

#### 方式 A: 使用 VS Code Live Server（推荐）

1. 在 VS Code 扩展商店安装 "Live Server"
2. 右键点击 `d:\个人网站\frontend\auth.html`
3. 选择 "Open with Live Server"
4. 浏览器会自动打开

#### 方式 B: 使用 Python

```bash
# 进入前端目录
cd d:\个人网站\frontend

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# 访问：http://localhost:8000/auth.html
```

#### 方式 C: 使用 Node.js http-server

```bash
# 全局安装（仅需一次）
npm install -g http-server

# 启动服务器
cd d:\个人网站\frontend
http-server -p 8000 -o

# 自动打开浏览器
```

### 步骤 6: 首次测试

1. 访问 `http://localhost:8000/auth.html`（或 Live Server 提供的地址）
2. 点击"注册"标签
3. 填写信息：
   ```
   用户名: testuser
   邮箱: test@example.com
   密码: 123456
   确认密码: 123456
   ```
4. 点击"注册"按钮
5. 应该看到"注册成功，跳转中..."
6. 自动跳转到菜单页面（此时菜品列表为空，这是正常的）

## 🍽️ 添加测试数据

### 方式 1: 使用 curl（最简单）

在后端终端启动后，打开新的终端窗口：

```bash
# 添加第一道菜
curl -X POST http://localhost:5000/api/dishes ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"番茄鸡蛋面\",\"description\":\"清汤番茄鸡蛋面，爽口开胃\",\"category\":\"面食\",\"price\":25,\"difficulty\":\"简单\",\"cookTime\":\"20分钟\",\"ingredients\":[\"番茄\",\"鸡蛋\",\"面条\",\"葱\"],\"steps\":[{\"order\":1,\"description\":\"烧水至沸腾\"},{\"order\":2,\"description\":\"番茄切块，鸡蛋打散\"},{\"order\":3,\"description\":\"水烧开后加面条\"}]}"

# 添加第二道菜
curl -X POST http://localhost:5000/api/dishes ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"红烧肉\",\"description\":\"肥瘦相间，软糯入味\",\"category\":\"家常菜\",\"price\":45,\"difficulty\":\"中等\",\"cookTime\":\"90分钟\",\"ingredients\":[\"猪肉\",\"冰糖\",\"酱油\",\"葱\",\"生姜\"],\"steps\":[{\"order\":1,\"description\":\"猪肉切块，焯水\"},{\"order\":2,\"description\":\"冰糖炒糖色\"},{\"order\":3,\"description\":\"加入肉块翻炒\"},{\"order\":4,\"description\":\"加酱油和水，烧1小时\"}]}"
```

✅ 看到 `{"success":true,"message":"菜品创建成功"...}` 表示成功

### 方式 2: 使用 Postman

1. 下载安装 Postman：https://www.postman.com/downloads/
2. 创建新的 Request
3. 设置为 POST，URL：`http://localhost:5000/api/dishes`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON)：
```json
{
  "name": "宫保鸡丁",
  "description": "脆爽花生，入味鸡块",
  "category": "家常菜",
  "price": 35,
  "difficulty": "简单",
  "cookTime": "25分钟",
  "ingredients": ["鸡胸肉", "花生", "辣椒", "酱油", "糖"],
  "steps": [
    {"order": 1, "description": "鸡肉切块"},
    {"order": 2, "description": "花生提前炒好"},
    {"order": 3, "description": "热油炒鸡肉"},
    {"order": 4, "description": "加酱料和花生翻炒"}
  ]
}
```
6. 点击 Send

## 📝 完整工作流测试

```
1. 打开 http://localhost:8000/auth.html
   ↓
2. 注册新账户 (如果还没有)
   ↓
3. 使用邮箱和密码登录
   ↓
4. 查看菜单页面（应该显示添加的菜品）
   ↓
5. 在搜索框搜索菜品
   ↓
6. 点击"详情"查看菜品全部信息
   ↓
7. 点击"加购"添加到购物车
   ↓
8. 点击右上角购物车图标
   ↓
9. 点击"去结算"
   ↓
10. 填写配送信息和取餐时间
    ↓
11. 点击"确认下单"
    ↓
12. 看到订单成功提示
    ↓
13. 点击"我的订单"查看订单列表
```

## 🔧 故障排除

### 问题：`npm install` 失败

```bash
# 清除缓存并重试
npm cache clean --force
npm install --legacy-peer-deps

# 如果仍然失败，尝试删除 node_modules 和 package-lock.json
rm -r node_modules
rm package-lock.json
npm install
```

### 问题：MongoDB 连接失败

```bash
# 检查 MongoDB 是否运行
# Windows: 打开 MongoDB Compass
# Linux/Mac: 运行 mongod

# 验证连接
mongo  # 进入 shell
# 输出 MongoDB 版本表示连接成功
exit
```

### 问题：前端无法访问后端 API

1. 确保后端在 `http://localhost:5000` 运行
2. 检查浏览器控制台（F12）的错误信息
3. 检查 `frontend/js/api.js` 中的 `API_BASE_URL`
4. 尝试在浏览器中访问 `http://localhost:5000/api/health` 验证

### 问题：CORS 错误

```
Access to XMLHttpRequest blocked by CORS policy
```

✅ 这在开发中很正常，后端已配置允许跨域

### 问题：看不到菜品

1. 检查是否成功添加了菜品（检查 curl 响应）
2. 尝试刷新前端页面
3. 打开浏览器开发工具（F12）查看网络请求
4. 检查请求是否成功 (200 状态码)

## 🎯 下一步

1. ✅ **完成上述所有步骤**
2. 📝 **自定义菜品数据**
   - 删除测试菜品
   - 添加你实际会做的菜品
3. 🎨 **自定义样式**
   - 修改 `frontend/css/style.css` 中的颜色
   - 更改导航栏 LOGO
   - 调整字体大小
4. 🚀 **邀请女朋友使用**
   - 创建共享账户
   - 发送应用链接
   - 收集反馈

## 📞 快速参考

| 需要做什么 | 命令 |
|-----------|------|
| 启动后端 | `cd backend && npm start` |
| 启动前端 | 使用 Live Server 或 `http-server` |
| 查看菜品 | `curl http://localhost:5000/api/dishes` |
| 添加菜品 | 参考上面的 curl 命令 |
| 停止服务 | `Ctrl + C` |
| 重启应用 | 停止 → 重新启动 |

## ⏱️ 预计时间

- 环境配置：5 分钟
- 启动服务：2 分钟
- 添加测试数据：3 分钟
- 完整测试：10 分钟
- **总计：约 20 分钟**

---

✅ **如果完成了上述所有步骤，恭喜！系统已经可以使用了！**

有问题？查看 README.md、SETUP.md 或 PROJECT_SUMMARY.md！
