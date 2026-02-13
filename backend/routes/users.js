const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;

        // 检查用户是否存在
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({
                success: false,
                message: '用户名或邮箱已被注册'
            });
        }

        user = new User({
            username,
            email,
            password,
            phone: phone || '',
            address: address || ''
        });

        await user.save();

        // 生成token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: '注册成功',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '注册失败',
            error: error.message
        });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '邮箱和密码不能为空'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误'
            });
        }

        // 生成token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '登录失败',
            error: error.message
        });
    }
});

// 获取用户信息
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取用户信息失败',
            error: error.message
        });
    }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
    try {
        const { phone, address, preferences } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                phone,
                address,
                preferences,
                updatedAt: Date.now()
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            message: '用户信息更新成功',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '更新用户信息失败',
            error: error.message
        });
    }
});

module.exports = router;
