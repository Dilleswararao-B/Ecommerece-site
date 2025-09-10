import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

// All cart routes require authentication
router.use(userAuth);


// Get user's cart
router.get('/get', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/update', updateCartItem);

// Remove item from cart
router.delete('/remove', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

export default router; 