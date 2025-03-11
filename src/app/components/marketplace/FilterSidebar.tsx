"use client";

import { useState } from 'react';
import { marketplaceCategories } from '../../lib/marketplace-data';
import { MarketplaceFilter } from '../../../types/marketplace';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    condition: true
  });

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  
  // Display only first 4 categories initially, then show/hide the rest
  const displayedCategories = showAllCategories 
    ? marketplaceCategories 
    : marketplaceCategories.slice(0, 4);

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
  
  const toggleSection = (section: 'categories' | 'price' | 'condition') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-2 text-gray-800">Refine Results</h3>
        <p className="text-xs text-gray-500">Use these filters to narrow down your search</p>
      </div>
      
      {/* Categories Section */}
      <div className="border-b pb-3">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
          {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSections.categories && (
          <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
            <div className="flex items-center mb-1">
              <input
                type="radio"
                id="category-all"
                name="category"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="mr-2 h-3 w-3"
              />
              <label htmlFor="category-all" className="text-xs text-gray-700">All Categories</label>
            </div>
            {displayedCategories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  checked={selectedCategory === category.name}
                  onChange={() => setSelectedCategory(category.name)}
                  className="mr-2 h-3 w-3"
                />
                <label htmlFor={`category-${category.id}`} className="text-xs text-gray-700">{category.name}</label>
              </div>
            ))}
            {marketplaceCategories.length > 4 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllCategories(!showAllCategories);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                {showAllCategories ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="border-b pb-3">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('price')}
        >
          <h3 className="text-sm font-semibold text-gray-700">Price Range</h3>
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSections.price && (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-1 border rounded-md text-xs"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="self-center text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-1 border rounded-md text-xs"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Condition Section */}
      <div className="border-b pb-3">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('condition')}
        >
          <h3 className="text-sm font-semibold text-gray-700">Condition</h3>
          {expandedSections.condition ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSections.condition && (
          <div className="space-y-1">
            <div className="flex items-center mb-1">
              <input
                type="radio"
                id="condition-all"
                name="condition"
                checked={selectedCondition === ''}
                onChange={() => setSelectedCondition('')}
                className="mr-2 h-3 w-3"
              />
              <label htmlFor="condition-all" className="text-xs text-gray-700">Any Condition</label>
            </div>
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center">
                <input
                  type="radio"
                  id={`condition-${condition}`}
                  name="condition"
                  checked={selectedCondition === condition}
                  onChange={() => setSelectedCondition(condition)}
                  className="mr-2 h-3 w-3"
                />
                <label htmlFor={`condition-${condition}`} className="text-xs text-gray-700">{condition}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex-1 text-xs font-medium"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-300 text-xs font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
} 