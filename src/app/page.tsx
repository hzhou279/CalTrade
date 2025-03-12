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
    <div style={{
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 50%, #ec4899 100%)",
      position: "relative"
    }}>
      {/* Background Decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent)"
      }}></div>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.1), transparent)"
      }}></div>
      
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white"
        }}>
          CalTrade
        </div>
        <nav style={{
          display: "flex",
          gap: "24px"
        }}>
          <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Marketplace</Link>
          <Link href="/auth/signin" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Sign In</Link>
          <Link href="/auth/signup" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Sign Up</Link>
        </nav>
      </header>
      
      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        zIndex: 10,
        overflowY: "auto"
      }}>
        {/* Card Container */}
        <div style={{
          width: "100%",
          maxWidth: "1400px", // Increased from 1200px
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          margin: "auto"
        }}>
          <div style={{ padding: "32px" }}>
            {/* Card Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h2 style={{ 
                fontSize: "30px", 
                fontWeight: "bold", 
                color: "#111827",
                margin: "0 0 8px 0"
              }}>
                CalTrade Marketplace
              </h2>
              <p style={{ 
                fontSize: "16px", 
                color: "#6b7280",
                margin: 0
              }}>
                Buy and sell items in the Berkeley community
              </p>
            </div>
            
            {/* Quick Search Bar */}
            <div style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px"
            }}>
              <form 
                onSubmit={handleQuickSearch}
                style={{
                  display: "flex",
                  flex: 1,
                  maxWidth: "600px",
                  margin: "0 auto"
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  display: "flex"
                }}>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      paddingLeft: "40px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "16px",
                      outline: "none",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    }}
                  />
                  <Search 
                    size={20} 
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#4f46e5",
                      color: "white",
                      border: "none",
                      borderRadius: "0 8px 8px 0",
                      padding: "0 16px",
                      cursor: "pointer"
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: showFilters ? "#f3f4f6" : "#4f46e5",
                  color: showFilters ? "#4f46e5" : "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {showFilters ? (
                  <>
                    <X size={18} />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <SlidersHorizontal size={18} />
                    Advanced Filters
                  </>
                )}
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar with filters - hidden by default */}
              {showFilters && (
                <div className="w-full md:w-1/4 bg-white p-6 rounded-lg border border-gray-200">
                  <FilterSidebar onFilterChange={setFilters} currentFilters={filters} />
                </div>
              )}
              
              {/* Main content with items */}
              <div className={`w-full ${showFilters ? 'md:w-3/4' : 'md:w-full'}`}>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredItems.map((item) => {
                      // Determine column span based on item category
                      let colSpan = "";
                      
                      // Only vehicles take up more space
                      if (item.category === 'Vehicles') {
                        colSpan = "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1";
                      } else {
                        colSpan = "col-span-1";
                      }
                      
                      return (
                        <div key={item.id} className={`${colSpan}`}>
                          <ItemCard item={item} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        padding: "16px 24px",
        textAlign: "center",
        color: "white",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{ margin: 0, fontSize: "14px" }}>
          © 2023 CalTrade. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 