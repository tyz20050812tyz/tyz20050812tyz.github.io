// 认证页面逻辑

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function switchTab(tabName) {
    // 隐藏所有表单
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    // 移除所有标签按钮的活跃状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示指定表单
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('registerForm').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    if (!email || !password) {
        showMessage(messageEl, '请填写邮箱和密码', 'error');
        return;
    }

    api.login(email, password).then(response => {
        if (response.success) {
            // 保存token和userId
            api.setToken(response.data.token);
            localStorage.setItem('userId', response.data.user.id);

            showMessage(messageEl, '登录成功，跳转中...', 'success');

            // 2秒后跳转到主页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(messageEl, response.message || '登录失败', 'error');
        }
    }).catch(err => {
        console.error('登录失败', err);
        showMessage(messageEl, '登录失败，请检查网络连接', 'error');
    });
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('registerMessage');

    if (!username || !email || !password || !confirmPassword) {
        showMessage(messageEl, '请填写所有字段', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(messageEl, '两次输入的密码不一致', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageEl, '密码长度至少为6位', 'error');
        return;
    }

    api.register({
        username,
        email,
        password
    }).then(response => {
        if (response.success) {
            // 保存token和userId
            api.setToken(response.data.token);
            localStorage.setItem('userId', response.data.user.id);

            showMessage(messageEl, '注册成功，跳转中...', 'success');

            // 2秒后跳转到主页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(messageEl, response.message || '注册失败', 'error');
        }
    }).catch(err => {
        console.error('注册失败', err);
        showMessage(messageEl, '注册失败，请检查网络连接', 'error');
    });
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}
