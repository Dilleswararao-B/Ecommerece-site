import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
const currency = '$'; 

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.products) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message || 'No products found')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/product/remove/${id}`, {
        headers: {
          'Authorization': token
        }
      });
      toast.success('Product removed');
      fetchList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* ------ Product List ------ */}
        {
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2"
              key={index}
            >
              <img className="w-12" src={item.image && item.image[0] ? item.image[0] : '/path/to/placeholder.png'} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p className="text-right md:text-center cursor-pointer text-lg" onClick={() => handleDelete(item._id)}>X</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List