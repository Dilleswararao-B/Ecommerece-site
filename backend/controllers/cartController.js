import UserModel from '../models/userModel.js';

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Getting cart for user ID:', userId);
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            console.log('User not found for cart retrieval');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const cartItems = user.cartData || [];
        console.log('Cart items retrieved:', cartItems.length);
        
        res.status(200).json({ 
            success: true, 
            cartItems,
            message: 'Cart retrieved successfully' 
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, name, image, price, size, quantity = 1 } = req.body;

        console.log('Add to cart request:', { userId, productId, name, price, size, quantity });

        if (!productId || !name || !price || !size) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        console.log('User found:', user.name, 'Current cart items:', user.cartData?.length || 0);

        let cartItems = user.cartData || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(
            item => item.productId === productId && item.size === size
        );

        if (existingItemIndex !== -1) {
            // Update quantity of existing item
            cartItems[existingItemIndex].quantity += quantity;
            console.log('Updated existing item quantity');
        } else {
            // Add new item
            cartItems.push({
                productId,
                name,
                image,
                price,
                size,
                quantity
            });
            console.log('Added new item to cart');
        }

        // Update user's cart
        user.cartData = cartItems;
        await user.save();
        console.log('Cart saved successfully. Total items:', cartItems.length);

        res.status(200).json({ 
            success: true, 
            cartItems,
            message: 'Item added to cart successfully' 
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size, quantity } = req.body;

        if (!productId || !size || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        if (quantity < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity must be at least 1' 
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let cartItems = user.cartData || [];
        
        const itemIndex = cartItems.findIndex(
            item => item.productId === productId && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found in cart' 
            });
        }

        cartItems[itemIndex].quantity = quantity;
        user.cartData = cartItems;
        await user.save();

        res.status(200).json({ 
            success: true, 
            cartItems,
            message: 'Cart item updated successfully' 
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size } = req.query; // Changed from req.body to req.query

        console.log('Remove from cart request:', { userId, productId, size });

        if (!productId || !size) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let cartItems = user.cartData || [];
        
        const filteredItems = cartItems.filter(
            item => !(item.productId === productId && item.size === size)
        );

        user.cartData = filteredItems;
        await user.save();

        res.status(200).json({ 
            success: true, 
            cartItems: filteredItems,
            message: 'Item removed from cart successfully' 
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        user.cartData = [];
        await user.save();

        res.status(200).json({ 
            success: true, 
            cartItems: [],
            message: 'Cart cleared successfully' 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}; 