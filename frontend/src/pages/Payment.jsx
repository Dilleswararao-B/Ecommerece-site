import React, { useContext, useState } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import stripeLogo from '../assets/stripe_logo.png';
import razorpayLogo from '../assets/razorpay_logo.png';

const Payment = () => {
  const { cartItems, currency, delivery_fee, clearCart, addOrder } = useContext(ShopContext);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cartItems.length > 0 ? delivery_fee : 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation if needed
    cartItems.forEach(item => {
      addOrder(item.productId, item.size);
    });
    clearCart();
    toast.success('Order Confirmed!');
    navigate('/orderplaced', { state: { address, paymentMethod, total } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-white rounded-2xl border border-gray-200 p-0 flex flex-col md:flex-row gap-8 shadow-none">
        {/* Left: Delivery Info */}
        <div className="flex-1 p-10">
          <h2 className="text-2xl font-bold mb-8 tracking-wide">DELIVERY INFORMATION <span className="inline-block align-middle w-16 h-[2px] bg-gray-400 ml-2"></span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="firstName" value={address.firstName} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="First name" />
            <input name="lastName" value={address.lastName} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Last name" />
          </div>
          <input name="email" value={address.email} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Email address" />
          <input name="street" value={address.street} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Street" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="city" value={address.city} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="City" />
            <input name="state" value={address.state} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="State" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="zip" value={address.zip} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Zipcode" />
            <input name="country" value={address.country} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Country" />
          </div>
          <input name="phone" value={address.phone} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Phone" />
        </div>
        {/* Right: Cart Totals and Payment */}
        <div className="w-full md:w-[420px] bg-white border-l border-gray-200 p-10 flex flex-col gap-8 rounded-r-2xl">
          <div>
            <h2 className="text-xl font-bold tracking-wide mb-1">CART TOTALS <span className="inline-block align-middle w-16 h-[2px] bg-gray-400 ml-2"></span></h2>
            <div className="w-full mt-4">
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
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide mb-1">PAYMENT METHOD <span className="inline-block align-middle w-16 h-[2px] bg-gray-400 ml-2"></span></h2>
            <div className="flex gap-4 mt-4">
              <button type="button" onClick={() => setPaymentMethod('stripe')} className={`flex items-center gap-2 px-6 py-3 rounded border text-base font-semibold transition ${paymentMethod === 'stripe' ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'}`}>
                <img src={stripeLogo} alt="Stripe" className="h-6" /> 
              </button>
              <button type="button" onClick={() => setPaymentMethod('razorpay')} className={`flex items-center gap-2 px-6 py-3 rounded border text-base font-semibold transition ${paymentMethod === 'razorpay' ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'}`}>
                <img src={razorpayLogo} alt="Razorpay" className="h-6" /> 
              </button>
              <button type="button" onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-2 px-6 py-3 rounded border text-base font-semibold transition ${paymentMethod === 'cod' ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'}`}>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> CASH ON DELIVERY
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors text-lg shadow-none mt-6">PLACE ORDER</button>
        </div>
      </form>
    </section>
  );
};

export default Payment; 