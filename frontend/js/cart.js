// 购物车管理
const cart = {
    items: [],

    init() {
        const stored = localStorage.getItem('cart');
        this.items = stored ? JSON.parse(stored) : [];
    },

    add(dish, quantity = 1) {
        const existingItem = this.items.find(item => item.dishId === dish._id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                dishId: dish._id,
                dishName: dish.name,
                price: dish.price,
                quantity
            });
        }

        this.save();
        this.updateUI();
    },

    remove(dishId) {
        this.items = this.items.filter(item => item.dishId !== dishId);
        this.save();
        this.updateUI();
    },

    updateQuantity(dishId, quantity) {
        const item = this.items.find(item => item.dishId === dishId);
        if (item) {
            if (quantity <= 0) {
                this.remove(dishId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateUI();
            }
        }
    },

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // 更新购物车显示
        this.renderCart();
    },

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const totalPriceElement = document.getElementById('totalPrice');

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-message">购物车为空</p>';
            totalPriceElement.textContent = '¥0.00';
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.dishName}</div>
          <div class="cart-item-price">¥${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="cart.updateQuantity('${item.dishId}', ${item.quantity - 1})">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="cart.updateQuantity('${item.dishId}', ${item.quantity + 1})">+</button>
          <button class="btn-remove" onclick="cart.remove('${item.dishId}')">删除</button>
        </div>
      </div>
    `).join('');

        const total = this.getTotal();
        totalPriceElement.textContent = `¥${total.toFixed(2)}`;
    }
};

// 初始化购物车
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
    cart.updateUI();
});
