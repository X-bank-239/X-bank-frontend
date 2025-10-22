class UIManager {
    constructor() {
        this.authModal = document.getElementById('authModal');
        this.registerForm = document.getElementById('registerForm');
        this.loginForm = document.getElementById('loginForm');
        
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.showAuthModal();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideAuthModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', () => {
            this.hideAuthModal();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
    }

    showAuthModal() {
        if (this.authModal) {
            this.authModal.style.display = 'block';
            this.showRegisterForm();
        }
    }

    hideAuthModal() {
        if (this.authModal) {
            this.authModal.style.display = 'none';
        }
    }

    showRegisterForm() {
        if (this.registerForm && this.loginForm) {
            document.getElementById('modalTitle').textContent = 'Регистрация';
            this.registerForm.style.display = 'block';
            this.loginForm.style.display = 'none';
        }
    }

    showLoginForm() {
        if (this.registerForm && this.loginForm) {
            document.getElementById('modalTitle').textContent = 'Вход';
            this.registerForm.style.display = 'none';
            this.loginForm.style.display = 'block';
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('regUsername').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value
        };

        try {
            this.setLoadingState(true);
            const result = await AuthService.register(userData);
            this.showNotification('Регистрация успешна. Теперь войдите в аккаунт.', 'success');
            this.clearForm('registerFormElement');
            this.showLoginForm();
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const credentials = {
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
        };

        try {
            this.setLoadingState(true);
            const result = await AuthService.login(credentials);
            this.showNotification('Вход выполнен успешно', 'success');
            this.hideAuthModal();
            this.clearForm('loginFormElement');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        const buttons = document.querySelectorAll('#registerFormElement button, #loginFormElement button');
        buttons.forEach(button => {
            button.disabled = isLoading;
            button.textContent = isLoading ? 'Загрузка...' : 
                (button.closest('#registerFormElement') ? 'Создать аккаунт' : 'Войти');
        });
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
    }
}

window.UIManager = new UIManager();