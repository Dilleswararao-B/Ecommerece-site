import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

// Generate JWT token
export const generateToken = (userId, expiresIn = '1d') => {
    try {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn }
        );
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
    try {
        return jwt.sign(
            { id: userId, type: 'refresh' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw new Error('Refresh token generation failed');
    }
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return { valid: false, error: error.message };
    }
};

// Verify token and get user
export const verifyTokenAndGetUser = async (token) => {
    try {
        const { valid, decoded, error } = verifyToken(token);
        
        if (!valid) {
            return { valid: false, error };
        }

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return { valid: false, error: 'User not found' };
        }

        return { valid: true, user };
    } catch (error) {
        console.error('Error verifying token and getting user:', error);
        return { valid: false, error: 'Token verification failed' };
    }
};

// Decode token without verification (for logging/debugging)
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        return Date.now() >= decoded.exp * 1000;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

// Get token expiration time
export const getTokenExpiration = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return null;
        }
        return new Date(decoded.exp * 1000);
    } catch (error) {
        console.error('Error getting token expiration:', error);
        return null;
    }
}; 