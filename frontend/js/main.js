// 主应用逻辑

let allDishes = [];

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 检查用户是否已登录
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    window.location.href = 'auth.html';
    return;
  }
  
  // 加载菜品列表
  loadDishes();
  
  // 事件监听
  setupEventListeners();
});

function setupEventListeners() {
  // 搜索功能
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const search = searchInput.value;
      const category = document.getElementById('categoryFilter').value;
      filterDishes(search, category);
    }, 300));
  }
  
  // 分类筛选
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const search = document.getElementById('searchInput').value;
      const category = categoryFilter.value;
      filterDishes(search, category);
    });
  }
  
  // 导航链接
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = link.getAttribute('href').slice(1);
      navigateTo(pageName);
      link.classList.add('active');
    });
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function loadDishes() {
  api.getDishes({}).then(response => {
    if (response.success) {
      allDishes = response.data;
      renderDishes(allDishes);
    } else {
      console.error('获取菜品列表失败', response.message);
    }
  }).catch(err => {
    console.error('获取菜品列表失败', err);
  });
}

function filterDishes(search, category) {
  let filtered = allDishes;
  
  if (category) {
    filtered = filtered.filter(dish => dish.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(dish => 
      dish.name.toLowerCase().includes(searchLower) ||
      dish.description.toLowerCase().includes(searchLower)
    );
  }
  
  renderDishes(filtered);
}

function renderDishes(dishes) {
  const dishesGrid = document.getElementById('dishesGrid');
  
  if (dishes.length === 0) {
    dishesGrid.innerHTML = '<p class="empty-message">未找到菜品</p>';
    return;
  }
  
  dishesGrid.innerHTML = dishes.map(dish => {
    const emoji = getDishEmoji(dish.category);
    return `
      <div class="dish-card">
        <div class="dish-image">
          ${emoji}
          <span class="difficulty-badge">${dish.difficulty}</span>
        </div>
        <div class="dish-content">
          <div class="dish-name">${dish.name}</div>
          <div class="dish-description">${dish.description}</div>
          <div class="dish-meta">
            <span>⏱️ ${dish.cookTime}</span>
            <span>⭐ ${dish.rating}</span>
          </div>
          <div class="dish-price">¥${dish.price}</div>
          <div class="dish-footer">
            <div class="btn-details" onclick="showDishDetail('${dish._id}')">详情</div>
            <div class="btn-add" onclick="quickAddToCart('${dish._id}')">加购</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function quickAddToCart(dishId) {
  const dish = allDishes.find(d => d._id === dishId);
  if (dish) {
    cart.add(dish, 1);
    showNotification(`${dish.name} 已加入购物车！`);
  }
}

function showNotification(message) {
  // 创建临时通知
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
