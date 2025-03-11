export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  location?: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MarketplaceFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  searchQuery?: string;
} 