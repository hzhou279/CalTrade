"use client";

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { marketplaceItems } from '../../lib/marketplace-data';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const itemId = params.id as string;

  // Find the item with the matching ID
  const item = marketplaceItems.find((item) => item.id === itemId);

  // If item not found, show error
  if (!item) {
    return (
      <>
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-2">Item not found</h2>
            <p className="text-gray-500 mb-4">The item you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Find related items (same category, excluding current item)
  const relatedItems = marketplaceItems
    .filter(relatedItem => relatedItem.category === item.category && relatedItem.id !== item.id)
    .slice(0, 3);

  return (
    <>
      <MarketplaceHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Item Image */}
            <div className="md:w-1/2">
              <div className="relative h-96 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {item.condition}
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{item.title}</h1>
              </div>
              
              <p className="text-3xl font-bold mt-2">${item.price.toLocaleString()}</p>
              
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 text-gray-700">{item.description}</p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Details</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2">{item.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-2">{item.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Posted:</span>
                    <span className="ml-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Seller</h2>
                <div className="mt-2 flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">
                      {item.sellerName.charAt(0)}
                    </span>
                  </div>
                  <span className="ml-3">{item.sellerName}</span>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex-1 transition-colors">
                  Contact Seller
                </button>
                {session && item.sellerId === session.user?.id && (
                  <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
                    Edit Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link 
                  key={relatedItem.id} 
                  href={`/marketplace/${relatedItem.id}`}
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedItem.imageUrl}
                      alt={relatedItem.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{relatedItem.title}</h3>
                    <p className="font-bold mt-1">${relatedItem.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    </>
  );
} 