import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const product = products.find((e) => e._id === productId);

  const [mainImage, setMainImage] = useState(product ? product.image[0] : null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product) {
      setMainImage(product.image[0]);
      setSelectedSize(null);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }
  
  const handleImageClick = (newImage) => {
    setMainImage(newImage);
  };

  const renderSizeOptions = () => {
    const sizes = product.category === 'Kids' 
      ? ['1-2Y', '2-3Y', '3-4Y', '4-5Y'] 
      : ['S', 'M', 'L', 'XL'];
      
    return sizes.map((size) => (
      <div 
        key={size} 
        className={`border rounded-md py-2 px-4 cursor-pointer ${selectedSize === size ? 'border-yellow-400' : 'border-gray-300'}`}
        onClick={() => setSelectedSize(size)}
      >
        {size}
      </div>
    ));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size before adding to cart.');
      return;
    }
    
    const success = await addToCart(product, selectedSize, 1);
    if (success) {
      toast.success('Added to cart!');
    } else {
      toast.error('Failed to add to cart. Please login first and try again.');
    }
  };

  return (
    <section className="py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Product Images */}
        <div className="flex-1 flex flex-col items-center">
          {mainImage && <img src={mainImage} alt={product.name} className="w-full max-w-md rounded-lg shadow-lg" />}
          <div className="flex justify-center gap-2 mt-4">
            {product.image.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${product.name} view ${index + 1}`} 
                className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-yellow-400"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>

        {/* Right side: Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(4)].map((_, i) => <img key={i} src={assets.star_icon} alt="" className="w-5" />)}
              <img src={assets.star_dull_icon} alt="" className="w-5" />
            </div>
            <p>(122)</p>
          </div>
          <p className="text-2xl font-semibold text-gray-800 mb-4">{currency}{product.price}</p>
          
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Size:</p>
            <div className="flex gap-4">
              {renderSizeOptions()}
            </div>
          </div>

          <div className="flex justify-start">
            <button 
              className="w-auto bg-black text-white font-bold py-2 px-6 text-base rounded-md hover:bg-gray-900 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              ADD TO CART
            </button>
          </div>

          <div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <img src={assets.exchange_icon} alt="7-day return" className="w-8 h-8"/>
                <p>7 Days Return & Exchange</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <img src={assets.quality_icon} alt="quality product" className="w-8 h-8"/>
                <p>Quality Fabric Assured</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <img src={assets.support_img} alt="support" className="w-8 h-8"/>
                <p>24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className="mt-12">
        <div className="flex border-b">
          <button 
            className={`py-2 px-4 text-lg font-semibold ${activeTab === 'description' ? 'border-b-2 border-yellow-400' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`py-2 px-4 text-lg font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-yellow-400' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (122)
          </button>
        </div>
        <div className="py-6">
          {activeTab === 'description' ? (
            <p>{product.description}</p>
          ) : (
            <div>
              {/* Review submission form */}
              <form className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Submit your review</h3>
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <img key={i} src={assets.star_dull_icon} alt="" className="w-5 cursor-pointer" />)}
                </div>
                <textarea 
                  className="w-full border p-2 rounded-md" 
                  rows="4"
                  placeholder='Add your review...'
                ></textarea>
                <button type='submit' className='bg-black text-white font-bold py-2 px-4 rounded-md mt-2 hover:bg-gray-900'>Submit</button>
              </form>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts category={product.category} currentProductId={product._id} />
    </section>
  );
};

export default Product;