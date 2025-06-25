import React, { useState, useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../contexts/ShopContext'

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'COLLECTION', path: '/collection' },
  { name: 'CONTACT', path: '/contact' },
]

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { openSearch, cartItems } = useContext(ShopContext);

  // Calculate total quantity in cart
  const cartCount = cartItems && cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div className='flex items-center justify-between py-5 font-medium relative'>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className='w-36' />
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        {navItems.map(item => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className='flex flex-col items-center gap-1'
            >
              {({ isActive }) => (
                <>
                  <p>{item.name}</p>
                  <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${!isActive && 'hidden'}`} />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-6">
        <img 
          src={assets.search_icon} 
          className="w-5 cursor-pointer" 
          alt="Search" 
          onClick={openSearch}
        />
        <div className="group relative">
          <Link to="/login" className="rounded-full transition-colors duration-200 group-hover:bg-black p-1 block">
            <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <Link to="/orders" className="cursor-pointer hover:text-black">Orders</Link>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className='relative'>
          <img src={assets.cart_icon} className="w-5 min-w-5 cursor-pointer" alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {cartCount}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* Fullscreen menu for small screens */}
      <div className={`fixed inset-0 z-50 bg-white transition-all duration-300 ${visible ? 'block' : 'hidden'} sm:hidden`}>
        <div className="flex flex-col text-gray-600 h-full">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <ul className='flex flex-col gap-5 text-lg mt-8 items-center'>
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className='flex flex-col items-center gap-1'
                  onClick={() => setVisible(false)}
                >
                  {({ isActive }) => (
                    <>
                      <p>{item.name}</p>
                      <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${!isActive && 'hidden'}`} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar