// Authentication utility functions for frontend

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
function isAuthenticated() {
    const token = getAuthToken();
    if (!token) return false;

    // Check if token is expired
    try {
        const payload = parseJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch (e) {
        return false;
    }
}

/**
 * Parse JWT token (without verification)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

/**
 * Get user information from token
 * @returns {object|null} User object or null
 */
function getUserFromToken() {
    const token = getAuthToken();
    if (!token) return null;

    const payload = parseJWT(token);
    if (!payload) return null;

    return {
        id: payload.id,
        username: payload.username,
        email: payload.email
    };
}

/**
 * Logout user (clear token and redirect)
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Also remove old user object if it exists
    window.location.href = '/html/login/login.html';
}

/**
 * Get authorization headers for API requests
 * @returns {object} Headers object with Authorization
 */
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/html/login/login.html';
    }
}
