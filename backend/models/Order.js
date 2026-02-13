const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
            required: true
        },
        dishName: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: Number,
        subtotal: Number
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    pickupTime: {
        type: Date,
        required: true
    },
    specialRequests: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['待确认', '制作中', '已完成', '已取消'],
        default: '待确认'
    },
    paymentMethod: {
        type: String,
        enum: ['现金', '支付宝', '微信', '银行卡'],
        default: '现金'
    },
    paymentStatus: {
        type: String,
        enum: ['待支付', '已支付', '已退款'],
        default: '待支付'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

// 生成订单号
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const timestamp = Date.now();
        this.orderNumber = `ORD${timestamp}${count}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
