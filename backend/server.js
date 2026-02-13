const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dish-menu';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.error('数据库连接失败:', err);
});

// 路由导入
const dishRoutes = require('./routes/dishes');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

// 路由挂载
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '服务器错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
