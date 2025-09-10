import { createContext, useState, useEffect } from "react";
import React, { useContext } from 'react'
import tokenManager from '../utils/tokenManager.js';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;

  const backendUrl = 'http://localhost:5000'; // instead of import.meta.env.VITE_BACKEND_URL

  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState(tokenManager.getToken() || '');

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  // Orders state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [dbProducts, setDbProducts] = useState([]);
  

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = dbProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, [searchQuery, dbProducts]);

  // Fetch products from backend
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/product/list`);
        const data = await response.json();
        if (data.products) {
          setDbProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products from backend:", error);
      }
    };
    fetchDbProducts();
  }, [backendUrl]);

  // Fetch cart from backend when user is logged in
  useEffect(() => {
    if (token) {
      fetchCartFromBackend();
    } else {
      setCartItems([]);
    }
  }, [token]);

  // Refresh cart every 30 seconds when user is logged in (optional - for real-time sync)
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(() => {
      fetchCartFromBackend();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  // Function to fetch cart from backend
  const fetchCartFromBackend = async () => {
    try {
      const response = await tokenManager.authenticatedFetch(`${backendUrl}/api/cart/get`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(data.cartItems || []);
        }
      } else {
        const errorData = await response.json();
        console.error('Fetch cart error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching cart from backend:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Merge localStorage orders on login (cart is now handled by backend)
  useEffect(() => {
    if (token) {
      // Merge orders
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders((prev) => {
          // Avoid duplicate orders by id
          const ids = new Set(prev.map((o) => o.id));
          return [...prev, ...parsed.filter((o) => !ids.has(o.id))];
        });
      }
    }
  }, [token]);

  // Logout function
  const logout = () => {
    setToken('');
    setCartItems([]);
    tokenManager.clearTokens();
    // Do NOT clear orders here, so they persist across logins
  };

  // Login status
  const isLoggedIn = !!token;

  // Search functions
  const openSearch = () => {
    setShowSearch(true);
    setSearchQuery('');
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Add to cart
  const addToCart = async (product, size, quantity = 1) => {
    if (!size) {
      console.error('No size selected');
      return false;
    }
    
    if (!token) {
      console.error('User not logged in');
      return false;
    }
    
    try {
      const response = await tokenManager.authenticatedFetch(`${backendUrl}/api/cart/add`, {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          image: product.image[0],
          price: product.price,
          size,
          quantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(data.cartItems);
          return true;
        }
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message === 'No refresh token available') {
        console.error('User needs to login again');
      }
    }
    return false;
  };

  // Remove from cart
  const removeFromCart = async (productId, size) => {
    if (!token) return;
    
    try {
      console.log('Removing from cart:', { productId, size });
      const response = await tokenManager.authenticatedFetch(`${backendUrl}/api/cart/remove?productId=${productId}&size=${size}`, {
        method: 'DELETE'
      });

      console.log('Remove response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Remove response data:', data);
        if (data.success) {
          setCartItems(data.cartItems);
        }
      } else {
        const errorData = await response.json();
        console.error('Remove from cart error:', errorData);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update quantity
  const updateCartItem = async (productId, size, quantity) => {
    if (!token) return;
    
    try {
      console.log('Updating cart item:', { productId, size, quantity });
      const response = await tokenManager.authenticatedFetch(`${backendUrl}/api/cart/update`, {
        method: 'PUT',
        body: JSON.stringify({
          productId,
          size,
          quantity: Math.max(1, quantity)
        })
      });

      console.log('Update response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Update response data:', data);
        if (data.success) {
          setCartItems(data.cartItems);
          console.log('Cart items updated in UI:', data.cartItems);
        }
      } else {
        const errorData = await response.json();
        console.error('Update cart item error:', errorData);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!token) return;
    
    try {
      console.log('Clearing cart...');
      const response = await tokenManager.authenticatedFetch(`${backendUrl}/api/cart/clear`, {
        method: 'DELETE'
      });

      console.log('Clear response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Clear response data:', data);
        if (data.success) {
          setCartItems([]);
          console.log('Cart cleared in UI');
        }
      } else {
        const errorData = await response.json();
        console.error('Clear cart error:', errorData);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Add order
  const addOrder = (productId, size) => {
    console.log('=== ADDING ORDER TO FRONTEND STATE ===');
    console.log('Product ID:', productId);
    console.log('Size:', size);
    console.log('Order Date:', new Date().toISOString().slice(0, 10));
    
    const newOrder = {
      id: Date.now(),
      productId,
      size,
      orderedDate: new Date().toISOString().slice(0, 10),
      status: 'Ready to Ship',
    };
    
    console.log('New Order Object:', newOrder);
    setOrders((prev) => {
      const updatedOrders = [...prev, newOrder];
      console.log('Updated Orders Array:', updatedOrders);
      return updatedOrders;
    });
    console.log('=== END ADDING ORDER ===');
  };

  const value = {
    dbProducts,
    products: dbProducts,
    currency,
    delivery_fee,
    token,
    setToken,
    isLoggedIn,
    logout,
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    fetchCartFromBackend, // Expose this function so components can refresh cart
    // Orders
    orders,
    addOrder,
    // Search related
    searchQuery,
    showSearch,
    searchResults,
    openSearch,
    closeSearch,
    handleSearch
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;
