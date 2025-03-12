import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { itemService } from '@/app/lib/item-service';
import { MarketplaceFilter } from '@/types/marketplace';
import { initRedis } from '@/app/lib/redis';

// Initialize Redis connection
(async () => {
  await initRedis();
})();

/**
 * GET /api/items
 * Get all items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filter: MarketplaceFilter = {};
    
    // Extract filter parameters
    if (searchParams.has('category')) {
      filter.category = searchParams.get('category') || undefined;
    }
    
    if (searchParams.has('minPrice')) {
      const minPrice = parseFloat(searchParams.get('minPrice') || '');
      if (!isNaN(minPrice)) {
        filter.minPrice = minPrice;
      }
    }
    
    if (searchParams.has('maxPrice')) {
      const maxPrice = parseFloat(searchParams.get('maxPrice') || '');
      if (!isNaN(maxPrice)) {
        filter.maxPrice = maxPrice;
      }
    }
    
    if (searchParams.has('condition')) {
      filter.condition = searchParams.get('condition') || undefined;
    }
    
    if (searchParams.has('q')) {
      filter.searchQuery = searchParams.get('q') || undefined;
    }
    
    // Get items with applied filters
    const items = await itemService.getAllItems(
      Object.keys(filter).length > 0 ? filter : undefined
    );
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const itemData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'currency', 'category', 'condition'];
    for (const field of requiredFields) {
      if (!itemData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Add seller information
    const userId = session.user.id || 'unknown';
    const sellerName = session.user.name || 'Anonymous';
    
    // Create the item
    const newItem = await itemService.createItem(
      {
        ...itemData,
        sellerId: userId,
        sellerName,
      },
      userId
    );
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
} 