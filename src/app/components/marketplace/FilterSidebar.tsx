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
    <div className="text-sm">
      <h3 className="font-semibold text-base mb-3">Filters</h3>
      
      {/* Categories Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full text-left font-medium mb-2"
        >
          Categories
          {expandedSections.categories ? 
            <ChevronUp size={16} className="text-gray-500" /> : 
            <ChevronDown size={16} className="text-gray-500" />
          }
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2 pl-1">
            <div 
              className={`cursor-pointer py-1 px-2 rounded-md ${selectedCategory === '' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </div>
            
            {displayedCategories.map((category) => (
              <div 
                key={category.id}
                className={`cursor-pointer py-1 px-2 rounded-md ${selectedCategory === category.name ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </div>
            ))}
            
            {marketplaceCategories.length > 4 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-indigo-600 hover:text-indigo-800 text-xs mt-1 font-medium"
              >
                {showAllCategories ? 'Show Less' : `Show All (${marketplaceCategories.length})`}
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Price Range Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full text-left font-medium mb-2"
        >
          Price Range
          {expandedSections.price ? 
            <ChevronUp size={16} className="text-gray-500" /> : 
            <ChevronDown size={16} className="text-gray-500" />
          }
        </button>
        
        {expandedSections.price && (
          <div className="space-y-2 pl-1">
            <div className="flex items-center gap-2">
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">Min ($)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">Max ($)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Condition Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('condition')}
          className="flex justify-between items-center w-full text-left font-medium mb-2"
        >
          Condition
          {expandedSections.condition ? 
            <ChevronUp size={16} className="text-gray-500" /> : 
            <ChevronDown size={16} className="text-gray-500" />
          }
        </button>
        
        {expandedSections.condition && (
          <div className="space-y-2 pl-1">
            <div 
              className={`cursor-pointer py-1 px-2 rounded-md ${selectedCondition === '' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedCondition('')}
            >
              Any Condition
            </div>
            
            {conditions.map((condition) => (
              <div 
                key={condition}
                className={`cursor-pointer py-1 px-2 rounded-md ${selectedCondition === condition ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedCondition(condition)}
              >
                {condition}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleApplyFilters}
          className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
} 