import React, { useState } from 'react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Add your login/signup logic here
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
        />
      )}
      <input
        type="email"
        className='w-full px-3 py-2 border border-gray-800 placeholder:text-gray-400 rounded'
        placeholder="Email"
      />
      <input
        type="password"
        className='w-full px-3 py-2 border border-gray-800 placeholder:text-gray-400 rounded'
        placeholder="Password"
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