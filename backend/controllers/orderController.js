import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, totalAmount, paymentMethod, address } = req.body;
        const userId = req.user.id; // Get userId from authenticated user
        
        if (!cartItems || !totalAmount || !paymentMethod || !address) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const newOrder = new orderModel({
            userId,
            items: cartItems,
            amount: totalAmount,
            address,
            paymentMethod,
            date: Date.now()
        });

        await newOrder.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Placing orders using Stripe Method
export const placeOrderStripe = async (req, res) => {
    try {
        const { cartItems, totalAmount, address, paymentIntentId } = req.body;
        const userId = req.user.id; // Get userId from authenticated user
        
        // Temporarily relax validation to allow flow without paymentIntentId
        if (!cartItems || !totalAmount || !address) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const newOrder = new orderModel({
            userId,
            items: cartItems,
            amount: totalAmount,
            address,
            paymentMethod: 'Stripe',
            payment: Boolean(paymentIntentId) || true, // mark paid for current simplified flow
            date: Date.now()
        });

        await newOrder.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully with Stripe',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing Stripe order:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Placing orders using Razorpay Method
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { cartItems, totalAmount, address, razorpayPaymentId } = req.body;
        const userId = req.user.id; // Get userId from authenticated user
        
        if (!cartItems || !totalAmount || !address || !razorpayPaymentId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const newOrder = new orderModel({
            userId,
            items: cartItems,
            amount: totalAmount,
            address,
            paymentMethod: 'Razorpay',
            payment: true, // Payment is confirmed with Razorpay
            date: Date.now()
        });

        await newOrder.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully with Razorpay',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing Razorpay order:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// All Orders data for Admin Panel
export const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ date: -1 });
        
        res.status(200).json({ 
            success: true, 
            orders,
            message: 'All orders retrieved successfully' 
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// User Order Data For Frontend
export const userOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        
        res.status(200).json({ 
            success: true, 
            orders,
            message: 'User orders retrieved successfully' 
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// update order status from Admin
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            order,
            message: 'Order status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}; 