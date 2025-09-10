import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Order = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      const response = await axios.post(`${API_BASE_URL}/api/order/list`, {}, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        setError('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      
      const response = await axios.post(`${API_BASE_URL}/api/order/status`, {
        orderId,
        status: newStatus
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        )
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'text-blue-600'
      case 'Processing':
        return 'text-yellow-600'
      case 'Packing':
        return 'text-orange-600'
      case 'Shipped':
        return 'text-purple-600'
      case 'Delivered':
        return 'text-green-600'
      case 'Cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Page</h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Product Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      📦
                    </div>
                    <div className="flex-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.productName || 'Product'} x {item.quantity} {item.size}
                          {index < order.items.length - 1 && <br />}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">Shipping Address:</div>
                    <div>
                      {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.pincode}
                    </div>
                    <div>Phone: {order.address?.phone || 'N/A'}</div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Items:</span> {order.items.length}</div>
                  <div><span className="font-medium">Method:</span> {order.paymentMethod}</div>
                  <div><span className="font-medium">Payment:</span> {order.payment ? 'Paid' : 'Pending'}</div>
                  <div><span className="font-medium">Date:</span> {formatDate(order.date)}</div>
                </div>

                                 {/* Price and Status */}
                 <div className="space-y-3">
                   <div className="text-right">
                     <p className="text-lg font-semibold">${order.amount}</p>
                   </div>
                  
                  {/* Status Dropdown */}
                                     <div className="flex flex-col items-end space-y-2">
                     <div className={`font-medium ${getStatusColor(order.status)}`}>
                       {order.status}
                     </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Order