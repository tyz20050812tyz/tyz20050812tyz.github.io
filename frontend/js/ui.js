// UI 控制函数

// 页面导航
function navigateTo(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 移除所有导航链接的活跃状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // 显示指定页面
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 设置导航链接活跃状态
    event.target.classList.add('active');

    // 如果是订单页，重新加载订单
    if (pageName === 'orders') {
        loadOrders();
    }

    // 如果是个人中心，加载用户信息
    if (pageName === 'profile') {
        loadProfile();
    }
}

// 购物车相关
function openCart() {
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function goToCheckout() {
    if (cart.items.length === 0) {
        alert('购物车为空！');
        return;
    }

    closeCart();
    openCheckout();
}

// 菜品详情相关
function showDishDetail(dishId) {
    const modal = document.getElementById('dishModal');
    const detailContainer = document.getElementById('dishDetail');

    // 从已加载的菜品中查找
    const dish = window.allDishes && window.allDishes.find(d => d._id === dishId);

    if (!dish) {
        // 如果没有，从API获取
        api.getDish(dishId).then(response => {
            if (response.success) {
                renderDishDetail(response.data);
                modal.classList.add('active');
            }
        }).catch(err => console.error('获取菜品详情失败', err));
    } else {
        renderDishDetail(dish);
        modal.classList.add('active');
    }
}

function renderDishDetail(dish) {
    const detailContainer = document.getElementById('dishDetail');
    const emoji = getDishEmoji(dish.category);

    let stepsHTML = '';
    if (dish.steps && dish.steps.length > 0) {
        stepsHTML = '<div class="detail-steps">' +
            dish.steps.map(step => `
        <div class="step">
          <span class="step-number">第${step.order}步：</span>${step.description}
        </div>
      `).join('') +
            '</div>';
    }

    detailContainer.innerHTML = `
    <div class="dish-detail-image">${emoji}</div>
    <div class="dish-detail-info">
      <h3>${dish.name}</h3>
      <div class="dish-detail-rating">⭐ ${dish.rating} 分</div>
      <div class="dish-detail-price">¥${dish.price}</div>
      
      <div class="detail-section">
        <h4>描述</h4>
        <p>${dish.description}</p>
      </div>
      
      <div class="detail-section">
        <h4>难度与时间</h4>
        <p>难度：${dish.difficulty} | 时间：${dish.cookTime}</p>
      </div>
      
      <div class="detail-section">
        <h4>所需材料</h4>
        <ul class="ingredients-list">
          ${(dish.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
      
      <div class="quantity-control">
        <label for="detailQuantity">数量：</label>
        <input type="number" id="detailQuantity" value="1" min="1">
      </div>
      
      ${stepsHTML}
      
      <button class="btn btn-primary btn-large" onclick="addDishToCart('${dish._id}')">加入购物车</button>
    </div>
  `;
}

function addDishToCart(dishId) {
    const quantity = parseInt(document.getElementById('detailQuantity').value) || 1;
    const dish = window.allDishes && window.allDishes.find(d => d._id === dishId);

    if (dish) {
        cart.add(dish, quantity);
        closeDishModal();
        alert('已添加到购物车！');
    }
}

function closeDishModal() {
    document.getElementById('dishModal').classList.remove('active');
}

// 结账相关
function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    renderOrderSummary();

    // 设置最小取餐时间为当前时间后1小时
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const minTime = now.toISOString().slice(0, 16);
    document.getElementById('pickupTime').min = minTime;

    modal.classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function renderOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    const total = cart.getTotal();

    let html = '<div class="order-summary">';

    cart.items.forEach(item => {
        html += `
      <div class="summary-item">
        <span>${item.dishName} × ${item.quantity}</span>
        <span>¥${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    });

    html += `
    <div class="summary-total">
      <span>总计：</span>
      <span>¥${total.toFixed(2)}</span>
    </div>
  </div>`;

    summaryContainer.innerHTML = html;
}

function submitOrder(event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const specialRequests = document.getElementById('specialRequests').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!deliveryAddress || !pickupTime) {
        alert('请填写必要信息！');
        return;
    }

    const orderData = {
        userId,
        items: cart.items,
        deliveryAddress,
        pickupTime: new Date(pickupTime).toISOString(),
        specialRequests,
        paymentMethod
    };

    api.createOrder(orderData).then(response => {
        if (response.success) {
            cart.clear();
            closeCheckout();
            showSuccessModal(response.data.orderNumber);
        } else {
            alert('下单失败：' + (response.message || '未知错误'));
        }
    }).catch(err => {
        console.error('下单失败', err);
        alert('下单失败，请重试');
    });
}

function showSuccessModal(orderNumber) {
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    navigateTo('menu');
}

// 订单列表
function loadOrders() {
    const userId = localStorage.getItem('userId');

    api.getOrders(userId).then(response => {
        if (response.success) {
            renderOrders(response.data);
        } else {
            console.error('获取订单失败', response.message);
        }
    }).catch(err => console.error('获取订单失败', err));
}

function renderOrders(orders) {
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">暂无订单</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => {
        const statusMap = {
            '待确认': 'pending',
            '制作中': 'processing',
            '已完成': 'completed',
            '已取消': 'cancelled'
        };

        return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-number">订单号: ${order.orderNumber}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              ${new Date(order.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
          <span class="order-status ${statusMap[order.status]}">${order.status}</span>
        </div>
        
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <span>${item.dishName} × ${item.quantity}</span>
              <span>¥${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="order-footer">
          <div>
            <div style="margin-bottom: 5px;">配送地址：${order.deliveryAddress}</div>
            <div>取餐时间：${new Date(order.pickupTime).toLocaleString('zh-CN')}</div>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--primary-color); font-size: 18px; margin-bottom: 5px;">¥${order.totalAmount.toFixed(2)}</div>
            ${order.status === '待确认' ? `<button class="btn-remove" onclick="cancelOrder('${order._id}')">取消订单</button>` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function cancelOrder(orderId) {
    if (confirm('确定要取消订单吗？')) {
        api.cancelOrder(orderId).then(response => {
            if (response.success) {
                alert('订单已取消');
                loadOrders();
            } else {
                alert('取消失败：' + response.message);
            }
        }).catch(err => console.error('取消订单失败', err));
    }
}

// 个人中心
function loadProfile() {
    const userId = localStorage.getItem('userId');

    api.getUser(userId).then(response => {
        if (response.success) {
            const user = response.data;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('address').value = user.address || '';
        }
    }).catch(err => console.error('获取用户信息失败', err));
}

function submitProfile(event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    api.updateUser(userId, { phone, address }).then(response => {
        if (response.success) {
            alert('信息更新成功！');
        } else {
            alert('更新失败：' + response.message);
        }
    }).catch(err => {
        console.error('更新用户信息失败', err);
        alert('更新失败，请重试');
    });
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'auth.html';
    }
}

// 关闭购物车图标点击事件
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }

    // 表单提交事件
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', submitProfile);
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', submitOrder);
    }
});

// 获取菜品分类对应的emoji
function getDishEmoji(category) {
    const emojiMap = {
        '家常菜': '🍲',
        '汤羹': '🍜',
        '甜品': '🍰',
        '面食': '🍝',
        '海鲜': '🦞',
        '烧烤': '🍖'
    };
    return emojiMap[category] || '🍽️';
}

// 关闭模态框时的处理
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeDishModal();
        closeCheckout();
    }
});
