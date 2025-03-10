const { Redis } = require('ioredis');

// Get Redis URL from environment variable or use default
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
const redis = new Redis(redisUrl);

// Test connection
redis.ping().then(result => {
  console.log('Redis connection successful:', result);
  redis.set('test-key', 'Hello from CalTrade!').then(() => {
    console.log('Successfully set test key');
    redis.get('test-key').then(value => {
      console.log('Retrieved test key value:', value);
      redis.quit();
    });
  });
}).catch(error => {
  console.error('Redis connection failed:', error);
  redis.quit();
}); 