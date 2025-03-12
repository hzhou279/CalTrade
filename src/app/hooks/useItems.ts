import { useState } from 'react';
import { MarketplaceItem, MarketplaceFilter } from '@/types/marketplace';

/**
 * Custom hook for interacting with the items API
 */
export function useItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all items with optional filtering
   */
  const getItems = async (filter?: MarketplaceFilter): Promise<MarketplaceItem[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string from filter
      let queryString = '';
      if (filter) {
        const params = new URLSearchParams();
        
        if (filter.category) params.append('category', filter.category);
        if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
        if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
        if (filter.condition) params.append('condition', filter.condition);
        if (filter.searchQuery) params.append('q', filter.searchQuery);
        
        queryString = params.toString();
      }
      
      // Make API request
      const response = await fetch(`/api/items${queryString ? `?${queryString}` : ''}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch items');
      }
      
      const items = await response.json();
      return items;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a specific item by ID
   */
  const getItem = async (id: string): Promise<MarketplaceItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/items/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch item');
      }
      
      const item = await response.json();
      return item;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new item
   */
  const createItem = async (itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'sellerName'>): Promise<MarketplaceItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }
      
      const newItem = await response.json();
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing item
   */
  const updateItem = async (
    id: string,
    updates: Partial<Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'sellerName'>>
  ): Promise<MarketplaceItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }
      
      const updatedItem = await response.json();
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an item
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get the current user's items
   */
  const getUserItems = async (): Promise<MarketplaceItem[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/items/user');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user items');
      }
      
      const items = await response.json();
      return items;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getUserItems,
  };
} 