"use client";

import { useState, useEffect } from 'react';
import { marketplaceItems } from './lib/marketplace-data';
import ItemCard from './components/marketplace/ItemCard';
import FilterSidebar from './components/marketplace/FilterSidebar';
import MarketplaceHeader from './components/marketplace/MarketplaceHeader';
import { MarketplaceFilter, MarketplaceItem } from '../types/marketplace';

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketplaceFilter>({});
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(marketplaceItems);
  const [isLoading, setIsLoading] = useState(true);

  // Apply filters to items
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      const filtered = marketplaceItems.filter((item) => {
        // Filter by search query
        if (filters.searchQuery && !item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
            !item.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
          return false;
        }
  
        // Filter by category
        if (filters.category && item.category !== filters.category) {
          return false;
        }
  
        // Filter by condition
        if (filters.condition && item.condition !== filters.condition) {
          return false;
        }
  
        // Filter by price range
        if (filters.minPrice !== undefined && item.price < filters.minPrice) {
          return false;
        }
  
        if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
          return false;
        }
  
        return true;
      });
      
      setFilteredItems(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-[85px]">
            <FilterSidebar onFilterChange={setFilters} currentFilters={filters} />
          </div>
          
          {/* Main content with items */}
          <div className="w-full md:w-3/4">
            {/* Results summary */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isLoading ? 'Loading items...' : 
                  filteredItems.length === 0 ? 'No items found' : 
                  `${filteredItems.length} item${filteredItems.length === 1 ? '' : 's'} found`}
              </h2>
              <div className="text-sm text-gray-500">
                Sort by: <span className="font-medium">Newest first</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="bg-gray-200 h-5 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/4 mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-full mb-1"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h2 className="text-xl font-semibold mb-2">No items found</h2>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 