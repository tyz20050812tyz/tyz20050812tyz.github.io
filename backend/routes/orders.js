const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Dish = require('../models/Dish');

// 创建订单
router.post('/', async (req, res) => {
    try {
        const { userId, items, deliveryAddress, pickupTime, specialRequests, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: '订单项目不能为空'
            });
        }

        // 计算总金额并获取菜品信息
        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const dish = await Dish.findById(item.dishId);
            if (!dish) {
                return res.status(404).json({
                    success: false,
                    message: `菜品 ${item.dishId} 不存在`
                });
            }

            const subtotal = dish.price * item.quantity;
            totalAmount += subtotal;

            processedItems.push({
                dishId: dish._id,
                dishName: dish.name,
                quantity: item.quantity,
                price: dish.price,
                subtotal
            });
        }

        const order = new Order({
            userId,
            items: processedItems,
            totalAmount,
            deliveryAddress,
            pickupTime,
            specialRequests: specialRequests || '',
            paymentMethod: paymentMethod || '现金'
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: '订单创建成功',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '创建订单失败',
            error: error.message
        });
    }
});

// 获取用户订单
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('items.dishId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取订单失败',
            error: error.message
        });
    }
});

// 获取所有订单 (管理员)
router.get('/', async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;
        const orders = await Order.find(query)
            .populate('userId', 'username email phone')
            .populate('items.dishId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取订单列表失败',
            error: error.message
        });
    }
});

// 获取单个订单
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId')
            .populate('items.dishId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取订单失败',
            error: error.message
        });
    }
});

// 更新订单状态
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['待确认', '制作中', '已完成', '已取消'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: '无效的订单状态'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
                updatedAt: Date.now(),
                completedAt: status === '已完成' ? Date.now() : undefined
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        res.json({
            success: true,
            message: '订单状态更新成功',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '更新订单失败',
            error: error.message
        });
    }
});

// 取消订单
router.put('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        if (order.status !== '待确认') {
            return res.status(400).json({
                success: false,
                message: '只能取消待确认状态的订单'
            });
        }

        order.status = '已取消';
        order.updatedAt = Date.now();
        await order.save();

        res.json({
            success: true,
            message: '订单已取消',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '取消订单失败',
            error: error.message
        });
    }
});

module.exports = router;
