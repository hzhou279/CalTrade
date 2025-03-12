import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { itemService } from '@/app/lib/item-service';

/**
 * GET /api/items/user
 * Get items for the authenticated user
 */
export async function GET(request: NextRequest) {
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
    
    const userId = session.user.id || '';
    
    // Get the user's items
    const items = await itemService.getUserItems(userId);
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user items' },
      { status: 500 }
    );
  }
} 