import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager.js';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const { setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Frontend password length validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post('http://localhost:5000/api/user/register', { name, email, password });
        console.log('Register response:', response.data);
        if (response.data.token) {
          setToken(response.data.token);
          tokenManager.setTokens(response.data.token, response.data.refreshToken);
          toast.success('Registration successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
        console.log('Login response:', response.data);
        if (response.data.token) {
          setToken(response.data.token);
          tokenManager.setTokens(response.data.token, response.data.refreshToken);
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-black'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? (
        ''
      ) : (
        <input
          type="text"
          className='w-full px-3 py-2 border border-gray-800 placeholder:text-gray-400 rounded'
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}
      <input
        type="email"
        className='w-full px-3 py-2 border border-gray-800 placeholder:text-gray-400 rounded'
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className='w-full px-3 py-2 border border-gray-800 placeholder:text-gray-400 rounded'
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create an account</p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login</p>
        )}
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState}</button>
    </form>
  );
};

export default Login;