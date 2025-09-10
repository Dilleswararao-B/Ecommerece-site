import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import Order from './pages/Order'
import List from './pages/List'
import Login from './components/Login'


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (

    <div className='bg-gray-100 w-full h-full'>
      {
        token === "" ? <Login setToken={setToken} />
          :
          <>
            <Navbar setToken={setToken}/>
            <hr className='border-gray-300' />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  <Route path='/' element={<Navigate to="/orders" replace />} />
                  <Route path='/add' element={<Add token={token}/>} />
                  <Route path='/orders' element={<Order token={token}/>} />
                  <Route path='/lists' element={<List token={token}/>} />
                </Routes>
              </div>

            </div>
          
          </>}

    </div>


  )
}

export default App
