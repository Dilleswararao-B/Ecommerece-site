import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderPlaced = () => {
  const location = useLocation();
  const { address, paymentMethod, total } = location.state || {};

  return (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center py-10 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full flex flex-col items-center">
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Order Placed" className="w-20 h-20 mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
        <p className="text-lg mb-6 text-center">Thank you for your purchase. Your order has been placed and will be delivered soon.</p>
        {address && (
          <div className="w-full mb-4">
            <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
            <div className="text-gray-700">
              <div>{address.firstName} {address.lastName}</div>
              <div>{address.email}</div>
              <div>{address.phone}</div>
              <div>{address.street}</div>
              <div>{address.city}, {address.state} {address.zip}</div>
              <div>{address.country}</div>
            </div>
          </div>
        )}
        {paymentMethod && (
          <div className="w-full mb-2">
            <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
            <div className="text-gray-700 capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</div>
          </div>
        )}
        {total && (
          <div className="w-full mb-4">
            <h2 className="text-xl font-semibold mb-1">Total Paid</h2>
            <div className="text-gray-700 font-bold">${total.toFixed(2)}</div>
          </div>
        )}
        <Link to="/collection" className="mt-4 bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-900 transition-colors">Continue Shopping</Link>
      </div>
    </section>
  );
};

export default OrderPlaced;