const backendUrl = 'http://localhost:5000';

// Token storage keys
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token management functions
export const tokenManager = {
    // Store tokens
    setTokens: (token, refreshToken) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    // Get access token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Get refresh token
    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    // Clear all tokens
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    // Check if token is expired
    isTokenExpired: (token) => {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    },

    // Get token expiration time
    getTokenExpiration: (token) => {
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return new Date(payload.exp * 1000);
        } catch (error) {
            console.error('Error getting token expiration:', error);
            return null;
        }
    },

    // Refresh token automatically
    refreshToken: async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${backendUrl}/api/user/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            
            // Store new tokens
            tokenManager.setTokens(data.token, data.refreshToken);
            
            return data.token;
        } catch (error) {
            console.error('Token refresh error:', error);
            tokenManager.clearTokens();
            throw error;
        }
    },

    // Get valid token (refresh if needed)
    getValidToken: async () => {
        const token = tokenManager.getToken();
        
        if (!token) {
            // No token at all: clear and redirect to login
            tokenManager.clearTokens();
            try { window.location.href = '/login'; } catch (_) {}
            throw new Error('No token available');
        }

        if (tokenManager.isTokenExpired(token)) {
            return await tokenManager.refreshToken();
        }

        return token;
    },

    // Create authenticated fetch function
    authenticatedFetch: async (url, options = {}) => {
        try {
            const token = await tokenManager.getValidToken();
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // If token is expired and we get 401, try to refresh
            if (response.status === 401) {
                try {
                    const newToken = await tokenManager.refreshToken();
                    const retryResponse = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            'Authorization': `Bearer ${newToken}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    return retryResponse;
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    tokenManager.clearTokens();
                    window.location.href = '/login';
                    throw refreshError;
                }
            }

            return response;
        } catch (error) {
            console.error('Authenticated fetch error:', error);
            // Handle missing refresh token scenario proactively
            if (error && String(error.message || '').includes('No refresh token available')) {
                tokenManager.clearTokens();
                try { window.location.href = '/login'; } catch (_) {}
            }
            throw error;
        }
    }
};

export default tokenManager; 