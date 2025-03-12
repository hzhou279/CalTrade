import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { itemService } from '@/app/lib/item-service';

/**
 * GET /api/items/[id]
 * Get a specific item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get the item
    const item = await itemService.getItem(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error fetching item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/items/[id]
 * Update a specific item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Get the current item to check ownership
    const existingItem = await itemService.getItem(id);
    
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the item
    if (existingItem.sellerId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this item' },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const updates = await request.json();
    
    // Update the item
    const updatedItem = await itemService.updateItem(id, updates);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(`Error updating item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete a specific item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Delete the item
    const success = await itemService.deleteItem(id, userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Item not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
} 