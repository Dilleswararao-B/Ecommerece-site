import { verifyTokenAndGetUser } from "../utils/jwtUtils.js";

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Check if authorization header exists and has Bearer token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        // Verify JWT token and get user
        const { valid, user, error } = await verifyTokenAndGetUser(token);
        
        if (!valid) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ 
                success: false, 
                message: error || "Invalid token format or expired token." 
            });
        }

        // Add user info to request object
        req.user = { 
            id: user._id,
            email: user.email,
            name: user.name
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error during authentication." 
        });
    }
};

export default userAuth; 