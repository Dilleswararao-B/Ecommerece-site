import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Login from './pages/Login'
import Cart from './pages/cart'
import OrderPlaced from './pages/orderPlaced'
import Product from './pages/Product'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ShopContext } from './contexts/ShopContext'
import Payment from './pages/Payment'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { showSearch } = useContext(ShopContext);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative'>
      <Navbar />
      <SearchBar />
      
      {/* Add space when search is active */}
      {showSearch && <div className="h-48"></div>}
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/orderplaced' element={<OrderPlaced />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <Footer />
    </div>
  )
}

export default App