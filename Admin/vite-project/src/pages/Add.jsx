import axios from 'axios';
import React, { useState } from 'react';
import assets from '../assets/assets';
import { backendUrl } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [subcategory, setSubcategory] = useState('Topwear');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);
      
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('price', price);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestseller);

    
      
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          'Authorization': token
        }
      });
      console.log(response.data);     
      toast.success('Product added!');
    
      
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
        toast.error(error.response.data.message || error.response.data || 'Failed to add product');
      } else {
        toast.error('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={image4 ? URL.createObjectURL(image4) : assets.upload_area} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
            </label>
          </div>
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className='w-full max-w-[500px] px-3 py-2' 
            type='text' 
            placeholder='Type here' 
            required
          />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className='w-full max-w-[500px] px-3 py-2' 
            placeholder='Write content' 
          />
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product category</p>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-3 py-2'
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub category</p>
            <select 
              value={subcategory} 
              onChange={(e) => setSubcategory(e.target.value)}
              className='w-full px-3 py-2'
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Product Price</p>
            <input 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              type='number' 
              placeholder='25' 
              className='w-full sm:w-[120px] px-3 py-2' 
            />
          </div>
        </div>
        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div>
              <p 
                className={`px-3 py-1 cursor-pointer ${sizes.includes('S') ? 'bg-slate-200' : 'bg-pink-100'}`}
                onClick={() => {
                  if (sizes.includes('S')) {
                    setSizes(sizes.filter(size => size !== 'S'));
                  } else {
                    setSizes([...sizes, 'S']);
                  }
                }}
              >
                S
              </p>
            </div>
            <div>
              <p 
                className={`px-3 py-1 cursor-pointer ${sizes.includes('M') ? 'bg-slate-200' : 'bg-pink-100'}`}
                onClick={() => {
                  if (sizes.includes('M')) {
                    setSizes(sizes.filter(size => size !== 'M'));
                  } else {
                    setSizes([...sizes, 'M']);
                  }
                }}
              >
                M
              </p>
            </div>
            <div>
              <p 
                className={`px-3 py-1 cursor-pointer ${sizes.includes('L') ? 'bg-slate-200' : 'bg-pink-100'}`}
                onClick={() => {
                  if (sizes.includes('L')) {
                    setSizes(sizes.filter(size => size !== 'L'));
                  } else {
                    setSizes([...sizes, 'L']);
                  }
                }}
              >
                L
              </p>
            </div>
            <div>
              <p 
                className={`px-3 py-1 cursor-pointer ${sizes.includes('XL') ? 'bg-slate-200' : 'bg-pink-100'}`}
                onClick={() => {
                  if (sizes.includes('XL')) {
                    setSizes(sizes.filter(size => size !== 'XL'));
                  } else {
                    setSizes([...sizes, 'XL']);
                  }
                }}
              >
                XL
              </p>
            </div>
            <div>
              <p 
                className={`px-3 py-1 cursor-pointer ${sizes.includes('XXL') ? 'bg-slate-200' : 'bg-pink-100'}`}
                onClick={() => {
                  if (sizes.includes('XXL')) {
                    setSizes(sizes.filter(size => size !== 'XXL'));
                  } else {
                    setSizes([...sizes, 'XXL']);
                  }
                }}
              >
                XXL
              </p>
            </div>
          </div>
        </div>
        <div className='flex gap-2 mt-2'>
          <input 
            type="checkbox" 
            id='bestseller' 
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
          />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>
        <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">ADD</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Add;