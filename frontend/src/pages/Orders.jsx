import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title';
import { ShopContext } from '../contexts/ShopContext';
import tokenManager from '../utils/tokenManager';

const Orders = () => {
  const { products } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingModal, setTrackingModal] = useState({ show: false, order: null });

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tokenManager.authenticatedFetch('http://localhost:5000/api/order/userorders', {
          method: 'POST',
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const openTrackingModal = (order) => {
    setTrackingModal({ show: true, order });
  };

  const closeTrackingModal = () => {
    setTrackingModal({ show: false, order: null });
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { name: 'Order Placed', completed: true, active: status === 'Order Placed' },
      { name: 'Processing', completed: ['Processing', 'Shipped', 'Delivered'].includes(status), active: status === 'Processing' },
      { name: 'Shipped', completed: ['Shipped', 'Delivered'].includes(status), active: status === 'Shipped' },
      { name: 'Delivered', completed: status === 'Delivered', active: status === 'Delivered' }
    ];
    return steps;
  };

  const getStatusIcon = (step, index) => {
    if (step.completed) {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (step.active) {
      return (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-semibold text-sm">{index + 1}</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-white">
        <div className="w-full max-w-5xl">
          <Title text1="My " text2="Orders" />
          <div className="mt-8 flex justify-center">
            <div className="text-gray-500">Loading orders...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-white">
        <div className="w-full max-w-5xl">
          <Title text1="My " text2="Orders" />
          <div className="mt-8 flex justify-center">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
        <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-white" style={{backgroundColor: 'white'}}>
        <div className="w-full max-w-5xl">
          <Title text1="My " text2="Orders" />
          <div className="mt-8 flex flex-col gap-0">
            {orders.length === 0 ? (
              <div className="text-center text-gray-500 py-20 text-lg">No orders yet.</div>
            ) : (
              orders.map((order) => {
                // Get the first item from the order for display
                const firstItem = order.items[0];
                const product = products.find(p => p._id === firstItem?.productId);
                if (!product) return null;
                
                return (
                  <div key={order._id} className="flex items-center w-full py-8" style={{marginLeft: '10%', marginRight: '10%'}}>
                    {/* Left: Product info */}
                    <div className="flex items-center gap-6 w-1/3">
                      <img src={product.image[0]} alt={product.name} className="w-20 h-20 object-cover rounded-md border" />
                      <div>
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-500 text-sm">Size: <span className="font-medium">{firstItem.size}</span></p>
                        <p className="text-gray-500 text-sm">Quantity: <span className="font-medium">{firstItem.quantity}</span></p>
                        <p className="text-gray-500 text-sm">Payment: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
                        <p className="text-gray-400 text-xs">Ordered: {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {/* Center: Status */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                        <span className="text-green-600 font-semibold">{order.status}</span>
                      </span>
                    </div>
                    {/* Right: Track Order */}
                    <div className="w-1/4 flex justify-end">
                      <button 
                        onClick={() => openTrackingModal(order)}
                        className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Tracking Modal */}
      {trackingModal.show && trackingModal.order && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeTrackingModal}
        >
                     <div 
             className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide"
             onClick={(e) => e.stopPropagation()}
             style={{
               scrollbarWidth: 'none',
               msOverflowStyle: 'none',
               WebkitScrollbar: {
                 display: 'none'
               }
             }}
           >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Tracking</h2>
              <button 
                onClick={closeTrackingModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">#{trackingModal.order._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{new Date(trackingModal.order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">₹{trackingModal.order.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold capitalize">{trackingModal.order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {trackingModal.order.items.map((item, index) => {
                  const product = products.find(p => p._id === item.productId);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={product?.image?.[0] || '/placeholder.png'} 
                        alt={product?.name || 'Product'} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Quantity: {item.quantity} | Price: ₹{item.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <div className="space-y-4">
                {getTrackingSteps(trackingModal.order.status).map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {getStatusIcon(step, index)}
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.name}
                      </p>
                      {step.active && (
                        <p className="text-sm text-gray-500 mt-1">Your order is currently being processed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {trackingModal.order.address && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    {trackingModal.order.address.street}, {trackingModal.order.address.city}, {trackingModal.order.address.state} {trackingModal.order.address.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t flex justify-end gap-3">
              <button 
                onClick={closeTrackingModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Orders