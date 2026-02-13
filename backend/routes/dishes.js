const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// 获取所有菜品
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const dishes = await Dish.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: dishes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取菜品列表失败',
            error: error.message
        });
    }
});

// 获取单个菜品详情
router.get('/:id', async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({
                success: false,
                message: '菜品不存在'
            });
        }
        res.json({
            success: true,
            data: dish
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取菜品详情失败',
            error: error.message
        });
    }
});

// 创建菜品 (需要管理员权限)
router.post('/', async (req, res) => {
    try {
        const { name, description, category, price, difficulty, cookTime, ingredients, steps } = req.body;

        const dish = new Dish({
            name,
            description,
            category,
            price,
            difficulty,
            cookTime,
            ingredients,
            steps
        });

        await dish.save();
        res.status(201).json({
            success: true,
            message: '菜品创建成功',
            data: dish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '创建菜品失败',
            error: error.message
        });
    }
});

// 更新菜品
router.put('/:id', async (req, res) => {
    try {
        const dish = await Dish.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: '菜品不存在'
            });
        }

        res.json({
            success: true,
            message: '菜品更新成功',
            data: dish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '更新菜品失败',
            error: error.message
        });
    }
});

// 删除菜品
router.delete('/:id', async (req, res) => {
    try {
        const dish = await Dish.findByIdAndDelete(req.params.id);

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: '菜品不存在'
            });
        }

        res.json({
            success: true,
            message: '菜品删除成功'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除菜品失败',
            error: error.message
        });
    }
});

// 添加评价
router.post('/:id/reviews', async (req, res) => {
    try {
        const { userId, userName, rating, comment } = req.body;
        const dish = await Dish.findById(req.params.id);

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: '菜品不存在'
            });
        }

        dish.reviews.push({
            userId,
            userName,
            rating,
            comment
        });

        await dish.save();
        res.json({
            success: true,
            message: '评价添加成功',
            data: dish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '添加评价失败',
            error: error.message
        });
    }
});

module.exports = router;
