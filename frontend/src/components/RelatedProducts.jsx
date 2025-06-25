import React, { useContext } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, currentProductId }) => {
  const { products } = useContext(ShopContext);

  const relatedProducts = products
    .filter(p => p.category === category && p._id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null; 
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 