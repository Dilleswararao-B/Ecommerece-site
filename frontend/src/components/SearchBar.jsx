import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';

const SearchBar = () => {
  const { 
    searchQuery, 
    showSearch, 
    closeSearch, 
    handleSearch 
  } = useContext(ShopContext);
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  if (!showSearch) return null;

  return (
    <div className="absolute top-20 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-4">
        {/* Search Header */}
        <div className="flex items-center justify-center">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full border border-gray-200 px-4 py-3 max-w-md w-full shadow-lg">
            <img src={assets.search_icon} alt="Search" className="w-5 h-5 mr-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 text-lg outline-none bg-transparent"
              autoFocus
            />
            <button
              type="button"
              onClick={closeSearch}
              className="ml-3 p-1 hover:bg-gray-200 rounded-full transition"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>

        {/* Search Hint */}
        <div className="mt-4 text-center">
          <p className="text-gray-500">Press Enter to search products</p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 