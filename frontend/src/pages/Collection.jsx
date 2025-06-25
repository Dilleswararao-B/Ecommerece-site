import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../contexts/ShopContext';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get search query from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Categories and subcategories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'kids', name: 'Kids' }
  ];

  const subCategories = [
    { id: 'all', name: 'All Types' },
    { id: 'topwear', name: 'Top Wear' },
    { id: 'bottomwear', name: 'Bottom Wear' },
    { id: 'nightwear', name: 'Night Wear' }
  ];

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply subcategory filter
    if (selectedSubCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'relevant':
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedSubCategory, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const FilterSection = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Types</h3>
        <div className="space-y-2">
          {subCategories.map(subCategory => (
            <label key={subCategory.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="subCategory"
                value={subCategory.id}
                checked={selectedSubCategory === subCategory.id}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{subCategory.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategory('all');
          setSelectedSubCategory('all');
          clearSearch();
        }}
        className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden bg-white p-4 border-b">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded"
        >
          <span>Filters</span>
          <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-4">
              <FilterSection />
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <FilterSection />
            </div>
          )}

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Header with Title and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <Title text1={'ALL'} text2={' COLLECTIONS'} />
                <p className="text-gray-600 mt-2">
                  Showing {filteredProducts.length} products
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="low-to-high">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
                {filteredProducts.map((item, index) => (
                  <ProductItem
                    key={index}
                    id={item._id}
                    image={Array.isArray(item.image) ? item.image : [item.image]}
                    name={item.name}
                    price={item.price}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery ? `No products found for "${searchQuery}"` : 'No products found matching your filters.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubCategory('all');
                    clearSearch();
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;