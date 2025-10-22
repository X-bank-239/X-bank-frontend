class AuthService {
    static async register(userData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка регистрации: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('AuthService register error:', error);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 401) {
                    throw new Error('Неверное имя пользователя или пароль');
                }
                
                throw new Error(errorData.message || `Ошибка входа: ${response.status}`);
            }

            const result = await response.json();
            
            this.setUserData(result);
            this.updateUI();
            
            return result;

        } catch (error) {
            console.error('AuthService login error:', error);
            throw error;
        }
    }

    static setUserData(userData) {
        localStorage.setItem('xbank_user', JSON.stringify(userData));
    }

    static getCurrentUser() {
        const user = localStorage.getItem('xbank_user');
        return user ? JSON.parse(user) : null;
    }

    static isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    static logout() {
        localStorage.removeItem('xbank_user');
        this.updateUI();
    }

    static updateUI() {
        const user = this.getCurrentUser();
        const welcomeView = document.getElementById('welcomeView');
        const dashboardView = document.getElementById('dashboardView');
        const headerActions = document.getElementById('headerActions');

        if (user) {
            if (welcomeView) welcomeView.style.display = 'none';
            if (dashboardView) {
                dashboardView.style.display = 'block';
                const userName = document.getElementById('userName');
                if (userName) userName.textContent = user.username || 'Пользователь';
            }
            if (headerActions) {
                headerActions.innerHTML = `
                    <div class="user-info">
                        <span>${user.username}</span>
                        <button class="secondary-button" onclick="AuthService.logout()">Выйти</button>
                    </div>
                `;
            }
        } else {
            if (welcomeView) welcomeView.style.display = 'flex';
            if (dashboardView) dashboardView.style.display = 'none';
            if (headerActions) {
                headerActions.innerHTML = `
                    <button class="primary-button" onclick="UIManager.showAuthModal()">Войти</button>
                `;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AuthService.updateUI();
});