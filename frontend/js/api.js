// API 配置
const API_BASE_URL = 'http://localhost:5000/api';

// API 函数集合
const api = {
    // 用户相关
    register(userData) {
        return fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }).then(res => res.json());
    },

    login(email, password) {
        return fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
    },

    getUser(userId) {
        return fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: this.authHeader()
        }).then(res => res.json());
    },

    updateUser(userId, userData) {
        return fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(userData)
        }).then(res => res.json());
    },

    // 菜品相关
    getDishes(filters = {}) {
        let url = `${API_BASE_URL}/dishes`;
        const params = new URLSearchParams();

        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);

        if (params.toString()) url += '?' + params.toString();

        return fetch(url, {
            headers: this.authHeader()
        }).then(res => res.json());
    },

    getDish(dishId) {
        return fetch(`${API_BASE_URL}/dishes/${dishId}`, {
            headers: this.authHeader()
        }).then(res => res.json());
    },

    addDish(dishData) {
        return fetch(`${API_BASE_URL}/dishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(dishData)
        }).then(res => res.json());
    },

    // 订单相关
    createOrder(orderData) {
        return fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(orderData)
        }).then(res => res.json());
    },

    getOrders(userId) {
        return fetch(`${API_BASE_URL}/orders/user/${userId}`, {
            headers: this.authHeader()
        }).then(res => res.json());
    },

    getOrder(orderId) {
        return fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: this.authHeader()
        }).then(res => res.json());
    },

    updateOrderStatus(orderId, status) {
        return fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify({ status })
        }).then(res => res.json());
    },

    cancelOrder(orderId) {
        return fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: this.authHeader()
        }).then(res => res.json());
    },

    // 辅助方法
    authHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    clearToken() {
        localStorage.removeItem('token');
    }
};
