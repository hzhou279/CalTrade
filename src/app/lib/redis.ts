// Redis client service
// TODO: Import the actual Redis client when the server is set up
// import { createClient } from 'redis';

// Create Redis client
// const redisClient = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379'
// });

// Placeholder for Redis client
const redisClient = {
  // This is a placeholder until the actual Redis server is set up
  // We'll implement basic in-memory storage for now
  _storage: new Map<string, { value: string, expiry?: number }>(),
  
  connect: async () => {
    console.log('Redis client connected (placeholder)');
    return;
  },
  
  get: async (key: string): Promise<string | null> => {
    const item = redisClient._storage.get(key);
    
    if (!item) return null;
    
    // Check if the item has expired
    if (item.expiry && item.expiry < Date.now()) {
      redisClient._storage.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  set: async (key: string, value: string, expireSeconds?: number): Promise<void> => {
    const item = {
      value,
      expiry: expireSeconds ? Date.now() + (expireSeconds * 1000) : undefined
    };
    
    redisClient._storage.set(key, item);
    return;
  },
  
  del: async (key: string): Promise<void> => {
    redisClient._storage.delete(key);
    return;
  },
  
  keys: async (pattern: string): Promise<string[]> => {
    // Simple pattern matching for keys (only supports '*' wildcard at the end)
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return Array.from(redisClient._storage.keys())
        .filter(key => key.startsWith(prefix));
    }
    return Array.from(redisClient._storage.keys());
  },
  
  // Clear expired keys (would be handled automatically by Redis in a real implementation)
  _clearExpired: () => {
    const now = Date.now();
    // Use Array.from to convert the entries iterator to an array first
    Array.from(redisClient._storage.entries()).forEach(([key, item]) => {
      if (item.expiry && item.expiry < now) {
        redisClient._storage.delete(key);
      }
    });
  }
};

// Initialize connection
export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
    
    // Set up periodic cleanup of expired keys (every 5 minutes)
    if (typeof window === 'undefined') { // Only run on server
      setInterval(() => {
        redisClient._clearExpired();
      }, 5 * 60 * 1000);
    }
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

export default redisClient; 