import React, { useContext } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import { Link } from 'react-router-dom';
import Title from '../components/Title';

const Cart = () => {
  const { cartItems, currency, delivery_fee, removeFromCart, updateCartItem } = useContext(ShopContext);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cartItems.length > 0 ? delivery_fee : 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/collection" className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-900 transition-colors">Shop Now</Link>
      </div>
    );
  }

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <Title text1="Your " text2="Cart" />
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Cart Items */}
          <div className="flex-1 divide-y">
            {cartItems.map((item) => (
              <div key={item.productId + item.size} className="flex items-center py-6 gap-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md border" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-500">Size: <span className="font-medium">{item.size}</span></p>
                  <p className="text-gray-700 font-bold mt-1">{currency}{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateCartItem(item.productId, item.size, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="px-3 font-semibold">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateCartItem(item.productId, item.size, item.quantity + 1)}
                  >+</button>
                </div>
                <button
                  className="ml-4 text-red-500 hover:text-red-700 font-bold text-lg"
                  onClick={() => removeFromCart(item.productId, item.size)}
                  title="Remove"
                >&#10005;</button>
              </div>
            ))}
          </div>
          {/* Cart Total Summary */}
          <div className="w-full md:w-80 flex-shrink-0 bg-gray-100 rounded-lg p-8 h-fit self-start md:ml-4 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-wide mb-1">CART TOTALS</h2>
              <hr className="border-t-2 border-gray-400 w-16 mb-2" />
            </div>
            <div className="w-full">
              <div className="flex justify-between py-2 text-lg">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-900">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg">
                <span className="text-gray-700">Shipping Fee</span>
                <span className="text-gray-900">{currency}{cartItems.length > 0 ? delivery_fee.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between py-2 text-xl font-bold border-t border-gray-300 mt-2">
                <span>Total</span>
                <span>{currency}{total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/payment" className="mt-8 block bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-900 transition-colors text-center">Proceed to Payment</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;