import React from 'react';

const NewsletterBox = () => (
  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 my-12 shadow-md">
    <p className="text-xl font-semibold mb-4 text-center text-black">
      <span className="font-bold text-black">Subscribe now</span> and get <span className="text-black font-bold">20% off</span>
    </p>
    <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Subscribe
      </button>
    </form>
  </div>
);

export default NewsletterBox;
