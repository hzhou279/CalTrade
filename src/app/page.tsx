"use client";

import { useState, useEffect } from 'react';
import { marketplaceItems } from './lib/marketplace-data';
import ItemCard from './components/marketplace/ItemCard';
import FilterSidebar from './components/marketplace/FilterSidebar';
import MarketplaceHeader from './components/marketplace/MarketplaceHeader';
import { MarketplaceFilter, MarketplaceItem } from '../types/marketplace';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketplaceFilter>({});
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(marketplaceItems);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery });
  };

  return (
    <>
      <MarketplaceHeader />
      
      <main className="flex justify-center p-2 sm:p-4 md:p-6 relative z-10 overflow-y-auto">
        {/* Card Container */}
        <div className="w-full max-w-[1400px] bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden mx-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Card Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                CalTrade Marketplace
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Buy and sell items in the Berkeley community
              </p>
            </div>
            
            {/* Search and Filters Row */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4">
              {/* Search Form */}
              <form 
                onSubmit={handleQuickSearch}
                className="flex flex-1 max-w-full sm:max-w-[800px]"
              >
                <div className="relative w-full flex flex-col sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-3 pl-9 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none border-2 border-gray-200 text-sm sm:text-base focus:outline-none focus:border-indigo-500"
                    />
                    <Search 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <div className="flex">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white border-none py-2 px-3 sm:px-4 text-sm sm:text-base font-medium"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-1 sm:gap-2 ${
                        showFilters ? "bg-gray-100 text-indigo-600" : "bg-indigo-600 text-white"
                      } border-none rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${
                        showFilters ? "border-l border-gray-200" : "border-l border-indigo-500"
                      }`}
                    >
                      {showFilters ? (
                        <>
                          <X size={16} />
                          <span className="hidden xs:inline">Hide</span> Filters
                        </>
                      ) : (
                        <>
                          <SlidersHorizontal size={16} />
                          Filters
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Sort By Dropdown */}
              <div className="text-xs sm:text-sm text-gray-500 flex items-center whitespace-nowrap justify-end mt-2 sm:mt-0">
                Sort by: <span className="font-medium ml-1">Newest first</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Sidebar with filters - hidden by default */}
              {showFilters && (
                <div className="w-full md:w-1/4 bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200">
                  <FilterSidebar onFilterChange={setFilters} currentFilters={filters} />
                </div>
              )}
              
              {/* Main content with items */}
              <div className={`w-full ${showFilters ? 'md:w-3/4' : 'md:w-full'}`}>
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {[...Array(10)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm h-64 animate-pulse">
                        <div className="bg-gray-200 h-32 rounded-t-lg"></div>
                        <div className="p-3">
                          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                          <div className="bg-gray-200 h-5 rounded w-1/4 mb-2"></div>
                          <div className="bg-gray-200 h-3 rounded w-full mb-1"></div>
                          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
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
                  <>
                    {/* Masonry layout for all screen sizes */}
                    <div className="masonry-grid">
                      {(() => {
                        // Determine number of columns based on screen size
                        // This will be handled by CSS, but we need to prepare the data
                        const getNumColumns = () => {
                          // Default to 2 columns (mobile)
                          if (typeof window === 'undefined') return 2;
                          
                          const width = window.innerWidth;
                          if (width < 640) return 2; // Mobile: 2 columns
                          if (width < 768) return 3; // Tablet: 3 columns
                          if (width < 1024) return 3; // Small desktop: 3 columns
                          if (width < 1280) return 4; // Medium desktop: 4 columns
                          return 5; // Large desktop: 5 columns
                        };
                        
                        const numColumns = getNumColumns();
                        
                        // Create columns for items
                        const columns: MarketplaceItem[][] = Array.from({ length: numColumns }, () => []);
                        
                        // Distribute items across columns
                        filteredItems.forEach((item, index) => {
                          const columnIndex = index % numColumns;
                          columns[columnIndex].push(item);
                        });
                        
                        // Render columns with items
                        return columns.map((columnItems, colIdx) => (
                          <div key={`column-${colIdx}`} className="masonry-column">
                            {columnItems.map((item) => (
                              <div key={item.id} className="mb-3 sm:mb-4">
                                <ItemCard item={item} />
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>
                    
                    {/* CSS for masonry grid */}
                    <style jsx>{`
                      .masonry-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                      }
                      
                      @media (min-width: 640px) {
                        .masonry-grid {
                          grid-template-columns: repeat(3, 1fr);
                          gap: 16px;
                        }
                      }
                      
                      @media (min-width: 1024px) {
                        .masonry-grid {
                          grid-template-columns: repeat(4, 1fr);
                        }
                      }
                      
                      @media (min-width: 1280px) {
                        .masonry-grid {
                          grid-template-columns: repeat(5, 1fr);
                        }
                      }
                      
                      .masonry-column {
                        display: flex;
                        flex-direction: column;
                      }
                    `}</style>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Post Item Button - Fixed position */}
      <Link
        href="/marketplace/new"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-200 z-20"
      >
        <div className="flex items-center">
          <span className="text-2xl mr-1">+</span>
          <span className="hidden sm:inline font-medium">Post Item</span>
        </div>
      </Link>
    </>
  );
} 