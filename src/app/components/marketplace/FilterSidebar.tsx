"use client";

import { useState } from 'react';
import { marketplaceCategories } from '../../lib/marketplace-data';
import { MarketplaceFilter } from '../../../types/marketplace';

interface FilterSidebarProps {
  onFilterChange: (filters: MarketplaceFilter) => void;
  currentFilters: MarketplaceFilter;
}

export default function FilterSidebar({ onFilterChange, currentFilters }: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery || '');
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [selectedCondition, setSelectedCondition] = useState(currentFilters.condition || '');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  
  // Display only first 6 categories initially, then show/hide the rest
  const displayedCategories = showAllCategories 
    ? marketplaceCategories 
    : marketplaceCategories.slice(0, 6);

  const handleApplyFilters = () => {
    onFilterChange({
      searchQuery,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      category: selectedCategory || undefined,
      condition: selectedCondition || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('');
    setSelectedCondition('');
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
          />
          <button 
            onClick={handleApplyFilters}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="category-all"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="mr-2"
            />
            <label htmlFor="category-all" className="text-gray-700">All Categories</label>
          </div>
          {displayedCategories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="category"
                checked={selectedCategory === category.name}
                onChange={() => setSelectedCategory(category.name)}
                className="mr-2"
              />
              <label htmlFor={`category-${category.id}`} className="text-gray-700">{category.name}</label>
            </div>
          ))}
          {marketplaceCategories.length > 6 && (
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              {showAllCategories ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full p-2 border rounded-md"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="self-center">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full p-2 border rounded-md"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="condition-all"
              name="condition"
              checked={selectedCondition === ''}
              onChange={() => setSelectedCondition('')}
              className="mr-2"
            />
            <label htmlFor="condition-all" className="text-gray-700">Any Condition</label>
          </div>
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center">
              <input
                type="radio"
                id={`condition-${condition}`}
                name="condition"
                checked={selectedCondition === condition}
                onChange={() => setSelectedCondition(condition)}
                className="mr-2"
              />
              <label htmlFor={`condition-${condition}`} className="text-gray-700">{condition}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
} 