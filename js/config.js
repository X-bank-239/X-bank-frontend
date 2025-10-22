// Configuration for API endpoints
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api', // Change this to your backend URL
    
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
        REFRESH_TOKEN: '/auth/refresh'
    },
    
    // Accounts endpoints
    ACCOUNTS: {
        LIST: '/accounts',
        DETAIL: '/accounts/:id',
        BALANCE: '/accounts/:id/balance'
    },
    
    // Transactions endpoints
    TRANSACTIONS: {
        LIST: '/transactions',
        CREATE: '/transactions',
        DETAIL: '/transactions/:id',
        HISTORY: '/transactions/history'
    },
    
    // Transfers endpoints
    TRANSFERS: {
        CREATE: '/transfers',
        VALIDATE: '/transfers/validate'
    }
};

// App info
const APP_INFO = {
    name: 'Онлайн-Банк',
    version: '1.0.0',
    year: '2025'
};

// Current user session
let CURRENT_USER = {
    id: null,
    name: 'Гость',
    token: null,
    refreshToken: null
};

// Helper function to get full API URL
function getApiUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // Replace URL parameters
    for (const [key, value] of Object.entries(params)) {
        url = url.replace(`:${key}`, value);
    }
    
    return url;
}