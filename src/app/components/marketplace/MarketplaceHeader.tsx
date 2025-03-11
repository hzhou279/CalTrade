"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MarketplaceHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                CalTrade Marketplace
              </h1>
            </Link>
            <p className="text-gray-500">Buy and sell items in the Berkeley community</p>
          </div>
          <div className="flex space-x-4 items-center">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Welcome, {session.user?.name || 'User'}</span>
                </div>
                <Link 
                  href="/marketplace/my-items" 
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  My Items
                </Link>
                <Link 
                  href="/marketplace/new" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post New Item
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin?callbackUrl=/" 
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signin?callbackUrl=/marketplace/new" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign in to Post
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 