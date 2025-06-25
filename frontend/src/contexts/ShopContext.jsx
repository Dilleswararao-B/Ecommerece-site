import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";
import React, { useContext } from 'react'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  // Orders state
  const [orders, setOrders] = useState([]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, [searchQuery]);

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
  const addToCart = (product, size, quantity = 1) => {
    if (!size) return;
    setCartItems((prev) => {
      // Check if item with same product and size exists
      const existingIndex = prev.findIndex(
        (item) => item.productId === product._id && item.size === size
      );
      if (existingIndex !== -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      // Add new item
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.image[0],
          price: product.price,
          size,
          quantity,
        },
      ];
    });
  };

  // Remove from cart
  const removeFromCart = (productId, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  // Update quantity
  const updateCartItem = (productId, size, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Add order
  const addOrder = (productId, size) => {
    console.log('Adding order:', productId, size);
    setOrders((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId,
        size,
        orderedDate: new Date().toISOString().slice(0, 10),
        status: 'Ready to Ship',
      },
    ]);
  };

  const value = {
    products,
    currency,
    delivery_fee,
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
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
