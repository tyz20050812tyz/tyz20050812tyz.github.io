const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['家常菜', '汤羹', '甜品', '面食', '海鲜', '烧烤'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: 'default-dish.jpg'
    },
    difficulty: {
        type: String,
        enum: ['简单', '中等', '困难'],
        default: '中等'
    },
    cookTime: {
        type: String,
        default: '30分钟'
    },
    ingredients: [{
        type: String
    }],
    steps: [{
        order: Number,
        description: String
    }],
    available: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5
    },
    reviews: [{
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Dish', dishSchema);
