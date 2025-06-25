import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contexts/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
    setBestsellerProducts(products.slice(10, 20));
  }, [products]);

  return (
    <div className='my-10'>
      {/* Latest Collection Section */}
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={' COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8 mb-16'>
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={Array.isArray(item.image) ? item.image : [item.image]}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* Bestseller Section */}
      <div className='text-center py-8 text-3xl'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our most popular products, loved by our customers!
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8'>
        {bestsellerProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={Array.isArray(item.image) ? item.image : [item.image]}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;