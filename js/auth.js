// Authentication management
class AuthService {
    constructor() {
        this.checkAuthStatus();
    }

    // Check if user is logged in
    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                CURRENT_USER.token = token;
                CURRENT_USER = { ...CURRENT_USER, ...JSON.parse(userData) };
                this.updateUI();
                return true;
            } catch (error) {
                this.logout();
            }
        }
        return false;
    }

    // Login user
    async login(email, password) {
        try {
            const response = await api.login({ email, password });
            
            // Store auth data
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // Update current user
            CURRENT_USER = { ...CURRENT_USER, ...response.user, token: response.token };
            this.updateUI();
            
            showSuccess(`Добро пожаловать, ${response.user.name}!`);
            return true;
        } catch (error) {
            showError(error.message || 'Ошибка входа');
            return false;
        }
    }

    // Logout user
    async logout() {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Reset current user
            CURRENT_USER = {
                id: null,
                name: 'Гость',
                token: null,
                refreshToken: null
            };
            
            this.updateUI();
            showSuccess('Вы успешно вышли из системы');
        }
    }

    // Update UI based on auth status
    updateUI() {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        const welcomeTitleElement = document.getElementById('welcome-title');

        if (CURRENT_USER.token) {
            // User is logged in
            if (userNameElement) userNameElement.textContent = CURRENT_USER.name;
            if (userAvatarElement) userAvatarElement.textContent = CURRENT_USER.name.charAt(0);
            if (welcomeTitleElement) welcomeTitleElement.textContent = `Добро пожаловать, ${CURRENT_USER.name}!`;
        } else {
            // User is not logged in
            if (userNameElement) userNameElement.textContent = 'Гость';
            if (userAvatarElement) userAvatarElement.textContent = 'Г';
            if (welcomeTitleElement) welcomeTitleElement.textContent = 'Добро пожаловать!';
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!CURRENT_USER.token;
    }

    // Get current user
    getCurrentUser() {
        return { ...CURRENT_USER };
    }
}

// Create global auth instance
const auth = new AuthService();