import React from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { ShopContext } from '../contexts/ShopContext'
import { useContext,useEffect,useState } from 'react'


const Bestseller = () => {
    const { dbProducts } = useContext(ShopContext);
    const [bestsellerProducts,setBestsellerProducts] = useState([]);

    useEffect(()=>{
        const bestproducts = dbProducts.filter((item)=>item.bestseller === true);
        setBestsellerProducts(bestproducts.slice(0,5));
    },[dbProducts]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'BEST'} text2={' SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8'>
        {bestsellerProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
     
    </div>
  )
}

export default Bestseller