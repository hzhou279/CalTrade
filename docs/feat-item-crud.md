# Item CRUD Implementation

This document outlines the implementation of CRUD (Create, Read, Update, Delete) operations for marketplace items in the CalTrade application.

## Overview

The item CRUD functionality is implemented using a dual-storage approach:
- **Prisma with PostgreSQL**: Used for permanent storage of item data
- **Redis**: Used as a caching layer for improved performance

The implementation follows a layered architecture:

1. **Data Layer**: Prisma ORM for persistent storage, Redis for caching
2. **Service Layer**: Item service for business logic
3. **API Layer**: REST API endpoints
4. **Client Layer**: React hooks for frontend integration

## Setup

### Dependencies

The implementation leverages existing dependencies in the project:

```json
"dependencies": {
  "@prisma/client": "^6.4.1", // Prisma client for database operations
  "prisma": "^6.4.1",         // Prisma CLI and types
  "redis": "^4.7.0",          // Redis client
  "@types/redis": "^4.0.11",  // TypeScript types for redis
  "uuid": "^9.0.1",           // For generating unique IDs
  "@types/uuid": "^9.0.7"     // TypeScript types for uuid
}
```

### Environment Variables

The following environment variables should be set in your `.env` file:

```
# PostgreSQL (via Prisma)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/caltrade
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/caltrade

# Redis
REDIS_URL=redis://localhost:6379
```

### Database Schema

The Item model is defined in the Prisma schema (`prisma/schema.prisma`):

```prisma
model Item {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  currency    String
  imageUrl    String?
  category    String
  condition   String
  location    String?
  sellerId    String
  sellerName  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  seller      User     @relation("UserItems", fields: [sellerId], references: [id])

  @@index([sellerId])
  @@index([category])
}
```

## Components

### Prisma Integration (`prisma/schema.prisma`)

The Prisma schema defines the database structure:

- Provides type-safe database access
- Handles database migrations automatically
- Generates TypeScript types based on the schema
- Manages relationships between models (e.g., Item to User)

```prisma
model Item {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  currency    String
  imageUrl    String?
  category    String
  condition   String
  location    String?
  sellerId    String
  sellerName  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  seller      User     @relation("UserItems", fields: [sellerId], references: [id])

  @@index([sellerId])
  @@index([category])
}
```

### Redis Client (`src/app/lib/redis.ts`)

A Redis client service that provides caching operations:

- Currently implemented as a placeholder with in-memory storage
- Will be replaced with a real Redis client when the server is set up
- Provides methods: `get`, `set`, `del`, `keys`
- Includes cache expiration functionality
- Includes connection initialization

```typescript
// Example usage:
await redisClient.set('key', 'value', 3600); // Cache for 1 hour
const value = await redisClient.get('key');
```

### Item Service (`src/app/lib/item-service.ts`)

A service class that provides CRUD operations for marketplace items:

- Uses Prisma for database operations
- Uses Redis for caching frequently accessed data
- Implements methods for creating, reading, updating, and deleting items
- Handles user ownership and authorization
- Supports filtering items by various criteria
- Manages cache invalidation when data changes

```typescript
// Example usage:
const newItem = await itemService.createItem(itemData, userId);
const item = await itemService.getItem(itemId);
const updatedItem = await itemService.updateItem(itemId, updates);
const success = await itemService.deleteItem(itemId, userId);
const items = await itemService.getAllItems(filter);
const userItems = await itemService.getUserItems(userId);
```

### API Routes

#### Main Items API (`src/app/api/items/route.ts`)

- `GET /api/items`: Get all items with optional filtering
- `POST /api/items`: Create a new item (requires authentication)

#### Individual Item API (`src/app/api/items/[id]/route.ts`)

- `GET /api/items/[id]`: Get a specific item by ID
- `PUT /api/items/[id]`: Update a specific item (requires authentication and ownership)
- `DELETE /api/items/[id]`: Delete a specific item (requires authentication and ownership)

#### User Items API (`src/app/api/items/user/route.ts`)

- `GET /api/items/user`: Get items for the authenticated user (requires authentication)

### React Hooks

#### Item Hooks (`src/app/hooks/useItems.ts`)

A custom React hook that provides methods for interacting with the items API:

- Handles loading and error states
- Provides methods for all CRUD operations
- Simplifies API interaction in React components

```typescript
// Example usage in a React component:
const { loading, error, getItems, getItem, createItem, updateItem, deleteItem, getUserItems } = useItems();

// Fetch items
const items = await getItems({ category: 'electronics' });

// Create a new item
const newItem = await createItem({
  title: 'iPhone 13',
  description: 'Brand new, still in box',
  price: 799,
  currency: 'USD',
  imageUrl: '/images/iphone13.jpg',
  category: 'electronics',
  condition: 'New'
});
```

## Data Model

The marketplace item model is defined in the Prisma schema and exported as a TypeScript type:

```typescript
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
```

## Caching Strategy

The implementation uses a "cache-aside" pattern:

1. **Read Operations**:
   - First check if the data exists in Redis cache
   - If found, return the cached data
   - If not found, query the database via Prisma, then store the result in Redis cache

2. **Write Operations**:
   - Write data to the database via Prisma first
   - Then update or invalidate the relevant Redis cache entries

3. **Cache Expiration**:
   - Cache entries have a configurable expiration time (default: 1 hour)
   - Expired entries are automatically removed

4. **Cache Invalidation**:
   - When an item is updated or deleted, its cache entry is invalidated
   - Bulk operations also invalidate relevant cache entries

## Authentication and Authorization

- All mutation operations (create, update, delete) require user authentication
- Update and delete operations require the user to be the owner of the item
- The user's ID is extracted from the session and used for authorization checks

## Performance Considerations

1. **Efficient Filtering**: 
   - Filtering is performed at the database level using Prisma's query capabilities
   - Complex queries bypass the cache and go directly to the database

2. **Batch Operations**:
   - User items are cached as a list of IDs to minimize data duplication
   - Individual items are cached separately for efficient retrieval

3. **Cache Warming**:
   - Frequently accessed items are automatically cached
   - User items are cached when first requested

4. **Type Safety**:
   - Prisma provides type safety between the database schema and application code
   - Reduces the risk of runtime errors due to type mismatches

## Future Improvements

1. **Redis Integration**: Replace the placeholder Redis client with a real Redis client when the server is set up
2. **Pagination**: Add pagination support for listing items using Prisma's pagination capabilities
3. **Advanced Filtering**: Enhance filtering capabilities with more options
4. **Image Upload**: Integrate with a file storage service for item images
5. **Cache Optimization**: Fine-tune cache expiration times based on usage patterns
6. **Real-time Updates**: Add WebSocket support for real-time item updates

## Testing

The implementation includes comprehensive error handling and validation, but should be tested thoroughly:

- Unit tests for the item service
- Integration tests for the API endpoints
- End-to-end tests for the complete flow
- Performance tests for caching effectiveness

## Conclusion

This implementation provides a robust foundation for item management in the CalTrade marketplace. The dual-storage approach with Prisma for database operations and Redis for caching offers a good balance between data durability, type safety, and performance. It follows best practices for TypeScript development, API design, and state management in React applications.
