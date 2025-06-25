import React, { useContext } from 'react'
import Title from '../components/Title';
import { ShopContext } from '../contexts/ShopContext';

const Orders = () => {
  const { orders, products, cartItems, addOrder } = useContext(ShopContext);

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center py-10 bg-gray-50">
      <div className="w-full max-w-5xl">
        <Title text1="My " text2="Orders" />
        <div className="mt-8 flex flex-col gap-0">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-20 text-lg">No orders yet.</div>
          ) : (
            orders.map((order) => {
              const product = products.find(p => p._id === order.productId);
              if (!product) return null;
              return (
                <div key={order.id} className="flex items-center w-full py-8" style={{marginLeft: '10%', marginRight: '10%'}}>
                  {/* Left: Product info */}
                  <div className="flex items-center gap-6 w-1/3">
                    <img src={product.image[0]} alt={product.name} className="w-20 h-20 object-cover rounded-md border" />
                    <div>
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-gray-500 text-sm">Size: <span className="font-medium">{order.size}</span></p>
                      <p className="text-gray-400 text-xs">Ordered: {order.orderedDate}</p>
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
                    <button className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-900 transition-colors">Track Order</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default Orders