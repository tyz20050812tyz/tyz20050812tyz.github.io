# 🍳 我的菜单 - 在线点餐系统

一个为女朋友设计的专业在线点餐系统，展示你的烹饪才华！

## 功能特性

✨ **用户认证系统**
- 用户注册和登录
- 密码加密存储
- 身份令牌验证

🍽️ **菜品管理**
- 丰富的菜品展示（含图片、价格、难度等级）
- 菜品分类和搜索
- 详细的烹饪步骤和材料列表
- 用户评价和评分

🛒 **购物车和订单**
- 实时购物车管理
- 订单确认页面
- 多种支付方式选择
- 配送地址和取餐时间设置
- 订单跟踪和取消

👤 **个人中心**
- 用户信息管理
- 订单历史查询
- 饮食偏好设置

## 项目结构

```
个人网站/
├── frontend/                      # 前端应用
│   ├── index.html                # 主页
│   ├── auth.html                 # 登录/注册页面
│   ├── css/
│   │   └── style.css             # 全局样式
│   ├── js/
│   │   ├── api.js                # API接口调用
│   │   ├── auth.js               # 认证逻辑
│   │   ├── cart.js               # 购物车管理
│   │   ├── ui.js                 # UI控制
│   │   └── main.js               # 主应用逻辑
│   └── assets/
│       └── images/               # 图片资源
│
└── backend/                       # 后端API
    ├── server.js                 # 应用入口
    ├── package.json              # 依赖配置
    ├── .env.example              # 环境变量示例
    ├── models/
    │   ├── Dish.js               # 菜品模型
    │   ├── Order.js              # 订单模型
    │   └── User.js               # 用户模型
    ├── routes/
    │   ├── dishes.js             # 菜品路由
    │   ├── orders.js             # 订单路由
    │   └── users.js              # 用户路由
    ├── controllers/              # 控制器（可选）
    └── middleware/               # 中间件（可选）
```

## 技术栈

**前端：**
- HTML5, CSS3, JavaScript (ES6+)
- 纯前端实现，无框架依赖

**后端：**
- Node.js + Express.js
- MongoDB (数据库)
- JWT (身份验证)
- Bcryptjs (密码加密)

## 快速开始

### 前置要求
- Node.js (v14+)
- MongoDB 本地或云服务

### 后端设置

1. **进入后端目录并安装依赖**
```bash
cd backend
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dish-menu
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

3. **启动服务器**
```bash
npm start
# 或使用开发模式（需要nodemon）
npm run dev
```

服务器将在 `http://localhost:5000` 运行

### 前端设置

1. **启动前端**
- 使用 Live Server 或其他本地开发服务器打开 `frontend/index.html`
- 或在浏览器中直接打开文件

2. **登录/注册**
- 首次访问会跳转到认证页面
- 使用邮箱和密码注册新账户或登录

## API 文档

### 用户相关

**POST /api/users/register** - 用户注册
```json
{
  "username": "用户名",
  "email": "邮箱@example.com",
  "password": "密码"
}
```

**POST /api/users/login** - 用户登录
```json
{
  "email": "邮箱@example.com",
  "password": "密码"
}
```

### 菜品相关

**GET /api/dishes** - 获取菜品列表
- 查询参数: `category` (分类), `search` (搜索)

**GET /api/dishes/:id** - 获取菜品详情

**POST /api/dishes** - 创建菜品（管理员）

### 订单相关

**POST /api/orders** - 创建订单
```json
{
  "userId": "用户ID",
  "items": [
    {
      "dishId": "菜品ID",
      "quantity": 数量
    }
  ],
  "deliveryAddress": "收货地址",
  "pickupTime": "2024-02-15T18:00:00Z",
  "specialRequests": "特殊要求",
  "paymentMethod": "支付方式"
}
```

**GET /api/orders/user/:userId** - 获取用户订单

**PUT /api/orders/:id/status** - 更新订单状态

**PUT /api/orders/:id/cancel** - 取消订单

## 菜品分类

系统支持的菜品分类：
- 🍲 家常菜
- 🍜 汤羹
- 🍰 甜品
- 🍝 面食
- 🦞 海鲜
- 🍖 烧烤

## 示例菜品数据

你可以通过以下方式添加菜品到数据库：

```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
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
      {"order": 3, "description": "水烧开后加面条"}
    ]
  }'
```

## 功能演示

1. **访问应用** → 打开 `frontend/auth.html`
2. **注册账户** → 输入邮箱、用户名、密码
3. **浏览菜单** → 查看可用菜品
4. **选择菜品** → 点击"加购"或"详情"了解更多
5. **管理购物车** → 调整数量或移除菜品
6. **下单** → 填写配送信息并提交订单
7. **追踪订单** → 在"我的订单"中查看状态

## 自定义

### 添加新的菜品分类
编辑 `backend/models/Dish.js` 中的 `category` 字段：
```javascript
category: {
  type: String,
  enum: ['家常菜', '汤羹', '甜品', '面食', '海鲜', '烧烤', '新分类'],
  required: true
}
```

### 修改样式
编辑 `frontend/css/style.css` 中的颜色变量：
```css
:root {
  --primary-color: #ff6b6b;      /* 主色调 */
  --secondary-color: #4ecdc4;    /* 辅助色 */
  --bg-color: #f7f9fc;           /* 背景色 */
}
```

### 更改 API 地址
编辑 `frontend/js/api.js`：
```javascript
const API_BASE_URL = 'http://your-api-url:5000/api';
```

## 常见问题

**Q: 如何连接到 MongoDB？**
A: 确保 MongoDB 正在运行，或使用 MongoDB Atlas（云数据库）的连接字符串

**Q: 前端和后端无法通信？**
A: 检查 CORS 配置，确保 `backend/server.js` 中有 `cors()` 中间件

**Q: 如何在生产环境部署？**
A: 
- 后端：使用 Heroku、Vercel 或自有服务器
- 前端：使用 Netlify、Vercel 或 GitHub Pages
- 数据库：使用 MongoDB Atlas

## 扩展功能建议

- [ ] 用户评价和评分系统
- [ ] 优惠券和折扣
- [ ] 订单通知（邮件/短信）
- [ ] 支付集成（支付宝、微信）
- [ ] 管理后台
- [ ] 订单预定功能
- [ ] 菜品热度排行
- [ ] 推荐算法

## License

MIT License

## 联系方式

有问题？创建一个 Issue 或联系开发者！

---

祝你点餐愉快！🍽️ 希望你的菜单能为女朋友带来美味！
