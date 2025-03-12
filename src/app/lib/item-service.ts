import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import redisClient from './redis';
import { MarketplaceFilter } from '../../types/marketplace';

// Initialize Prisma client
const prisma = new PrismaClient();

// Redis key prefixes
const ITEM_PREFIX = 'item:';
const USER_ITEMS_PREFIX = 'user:items:';
// Cache expiration time in seconds (1 hour)
const CACHE_EXPIRATION = 3600;

// Type for MarketplaceItem that matches Prisma's Item model
export type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: string;
  condition: string;
  location: string | null;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Item Service - Provides CRUD operations for marketplace items using Prisma for storage and Redis for caching
 */
export class ItemService {
  /**
   * Create a new marketplace item
   * @param item Item data without id, createdAt, and updatedAt
   * @param userId User ID of the creator
   * @returns The created item with generated id and timestamps
   */
  async createItem(
    item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<MarketplaceItem> {
    // Create item in PostgreSQL using Prisma
    const newItem = await prisma.item.create({
      data: {
        title: item.title,
        description: item.description,
        price: parseFloat(item.price.toString()),
        currency: item.currency,
        imageUrl: item.imageUrl,
        category: item.category,
        condition: item.condition,
        location: item.location,
        sellerId: userId,
        sellerName: item.sellerName,
      }
    });
    
    // Convert Prisma item to MarketplaceItem
    const marketplaceItem: MarketplaceItem = {
      ...newItem,
      price: parseFloat(newItem.price.toString()),
      createdAt: newItem.createdAt.toISOString(),
      updatedAt: newItem.updatedAt.toISOString(),
    };
    
    // Cache in Redis
    await redisClient.set(`${ITEM_PREFIX}${newItem.id}`, JSON.stringify(marketplaceItem), CACHE_EXPIRATION);
    
    // Update user's items list in Redis
    const userItemsKey = `${USER_ITEMS_PREFIX}${userId}`;
    const userItems = await this.getUserItemIds(userId);
    userItems.push(newItem.id);
    await redisClient.set(userItemsKey, JSON.stringify(userItems), CACHE_EXPIRATION);
    
    // Invalidate all items cache
    await this.invalidateCache('all_items');
    
    return marketplaceItem;
  }
  
  /**
   * Get an item by its ID
   * @param id Item ID
   * @returns The item or null if not found
   */
  async getItem(id: string): Promise<MarketplaceItem | null> {
    // Try to get from Redis cache first
    const cachedItem = await redisClient.get(`${ITEM_PREFIX}${id}`);
    
    if (cachedItem) {
      return JSON.parse(cachedItem) as MarketplaceItem;
    }
    
    // If not in cache, get from PostgreSQL using Prisma
    const item = await prisma.item.findUnique({
      where: { id }
    });
    
    if (!item) return null;
    
    // Convert Prisma item to MarketplaceItem
    const marketplaceItem: MarketplaceItem = {
      ...item,
      price: parseFloat(item.price.toString()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
    
    // Cache the result in Redis
    await redisClient.set(`${ITEM_PREFIX}${id}`, JSON.stringify(marketplaceItem), CACHE_EXPIRATION);
    
    return marketplaceItem;
  }
  
  /**
   * Update an existing item
   * @param id Item ID
   * @param updates Partial item data to update
   * @returns The updated item or null if not found
   */
  async updateItem(
    id: string,
    updates: Partial<Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>>
  ): Promise<MarketplaceItem | null> {
    // Get the current item
    const item = await this.getItem(id);
    if (!item) return null;
    
    // Update in PostgreSQL using Prisma
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.price && { price: parseFloat(updates.price.toString()) }),
        ...(updates.currency && { currency: updates.currency }),
        ...(updates.imageUrl && { imageUrl: updates.imageUrl }),
        ...(updates.category && { category: updates.category }),
        ...(updates.condition && { condition: updates.condition }),
        ...(updates.location && { location: updates.location }),
        ...(updates.sellerName && { sellerName: updates.sellerName }),
      }
    });
    
    // Convert Prisma item to MarketplaceItem
    const marketplaceItem: MarketplaceItem = {
      ...updatedItem,
      price: parseFloat(updatedItem.price.toString()),
      createdAt: updatedItem.createdAt.toISOString(),
      updatedAt: updatedItem.updatedAt.toISOString(),
    };
    
    // Update in Redis cache
    await redisClient.set(`${ITEM_PREFIX}${id}`, JSON.stringify(marketplaceItem), CACHE_EXPIRATION);
    
    // Invalidate all items cache
    await this.invalidateCache('all_items');
    
    return marketplaceItem;
  }
  
  /**
   * Delete an item by its ID
   * @param id Item ID
   * @param userId User ID (for authorization)
   * @returns true if deleted, false if not found or not authorized
   */
  async deleteItem(id: string, userId: string): Promise<boolean> {
    const item = await this.getItem(id);
    if (!item) return false;
    
    // Check if the user is the owner of the item
    if (item.sellerId !== userId) return false;
    
    // Delete from PostgreSQL using Prisma
    await prisma.item.delete({
      where: { id }
    });
    
    // Delete from Redis cache
    await redisClient.del(`${ITEM_PREFIX}${id}`);
    
    // Update user's items list in Redis
    const userItemsKey = `${USER_ITEMS_PREFIX}${userId}`;
    const userItems = await this.getUserItemIds(userId);
    const updatedUserItems = userItems.filter(itemId => itemId !== id);
    await redisClient.set(userItemsKey, JSON.stringify(updatedUserItems), CACHE_EXPIRATION);
    
    // Invalidate all items cache
    await this.invalidateCache('all_items');
    
    return true;
  }
  
  /**
   * Get all items (with optional filtering)
   * @param filter Optional filter criteria
   * @returns Array of items matching the filter
   */
  async getAllItems(filter?: MarketplaceFilter): Promise<MarketplaceItem[]> {
    // For filtered queries, we'll go directly to PostgreSQL for more efficient filtering
    if (filter && Object.keys(filter).length > 0) {
      return this.getFilteredItemsFromDB(filter);
    }
    
    // For unfiltered queries, try to get from Redis cache first
    const cacheKey = 'all_items';
    const cachedItems = await redisClient.get(cacheKey);
    
    if (cachedItems) {
      return JSON.parse(cachedItems) as MarketplaceItem[];
    }
    
    // If not in cache, get from PostgreSQL using Prisma
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert Prisma items to MarketplaceItems
    const marketplaceItems: MarketplaceItem[] = items.map(item => ({
      ...item,
      price: parseFloat(item.price.toString()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
    
    // Cache the result in Redis
    await redisClient.set(cacheKey, JSON.stringify(marketplaceItems), CACHE_EXPIRATION);
    
    return marketplaceItems;
  }
  
  /**
   * Get filtered items from PostgreSQL
   * @param filter Filter criteria
   * @returns Array of items matching the filter
   */
  private async getFilteredItemsFromDB(filter: MarketplaceFilter): Promise<MarketplaceItem[]> {
    // Build Prisma where clause based on filter
    const where: any = {};
    
    if (filter.category) {
      where.category = filter.category;
    }
    
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = filter.maxPrice;
      }
    }
    
    if (filter.condition) {
      where.condition = filter.condition;
    }
    
    if (filter.searchQuery) {
      where.OR = [
        { title: { contains: filter.searchQuery, mode: 'insensitive' } },
        { description: { contains: filter.searchQuery, mode: 'insensitive' } }
      ];
    }
    
    // Get filtered items from PostgreSQL using Prisma
    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert Prisma items to MarketplaceItems
    return items.map(item => ({
      ...item,
      price: parseFloat(item.price.toString()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }
  
  /**
   * Get items for a specific user
   * @param userId User ID
   * @returns Array of items belonging to the user
   */
  async getUserItems(userId: string): Promise<MarketplaceItem[]> {
    // Try to get user's item IDs from Redis
    const userItemsKey = `${USER_ITEMS_PREFIX}${userId}`;
    const cachedUserItemIds = await redisClient.get(userItemsKey);
    
    if (cachedUserItemIds) {
      const itemIds = JSON.parse(cachedUserItemIds) as string[];
      const items: MarketplaceItem[] = [];
      
      // Get each item (which will use cache if available)
      for (const id of itemIds) {
        const item = await this.getItem(id);
        if (item) {
          items.push(item);
        }
      }
      
      return items;
    }
    
    // If not in cache, get from PostgreSQL using Prisma
    const items = await prisma.item.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert Prisma items to MarketplaceItems
    const marketplaceItems: MarketplaceItem[] = items.map(item => ({
      ...item,
      price: parseFloat(item.price.toString()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
    
    // Cache the user's item IDs in Redis
    const itemIds = marketplaceItems.map(item => item.id);
    await redisClient.set(userItemsKey, JSON.stringify(itemIds), CACHE_EXPIRATION);
    
    // Also cache each individual item
    for (const item of marketplaceItems) {
      await redisClient.set(`${ITEM_PREFIX}${item.id}`, JSON.stringify(item), CACHE_EXPIRATION);
    }
    
    return marketplaceItems;
  }
  
  /**
   * Helper method to get a user's item IDs
   * @param userId User ID
   * @returns Array of item IDs
   */
  private async getUserItemIds(userId: string): Promise<string[]> {
    const userItemsKey = `${USER_ITEMS_PREFIX}${userId}`;
    const userItemsData = await redisClient.get(userItemsKey);
    
    if (userItemsData) {
      return JSON.parse(userItemsData) as string[];
    }
    
    // If not in cache, get from PostgreSQL using Prisma
    const items = await prisma.item.findMany({
      where: { sellerId: userId },
      select: { id: true }
    });
    
    const itemIds = items.map(item => item.id);
    
    // Cache the result
    await redisClient.set(userItemsKey, JSON.stringify(itemIds), CACHE_EXPIRATION);
    
    return itemIds;
  }
  
  /**
   * Invalidate cache for an item or collection
   * @param key Cache key to invalidate
   */
  private async invalidateCache(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

// Export a singleton instance
export const itemService = new ItemService(); 