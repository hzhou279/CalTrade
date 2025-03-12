"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MarketplaceHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-indigo-600 text-white sticky top-0 z-30 shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="block">
              <h1 className="text-xl sm:text-2xl font-bold text-white hover:text-indigo-100 transition-colors">
                CalTrade
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 hidden sm:block">Marketplace</p>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-1 text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex space-x-4 items-center">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-indigo-100">
                  <span>Welcome, {session.user?.name?.split(' ')[0] || 'User'}</span>
                </div>
                <Link 
                  href="/marketplace/my-items" 
                  className="text-indigo-100 hover:text-white hover:underline text-sm"
                >
                  My Items
                </Link>
                <Link 
                  href="/marketplace/new" 
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <span className="mr-1">+</span> Post Item
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin?callbackUrl=/" 
                  className="text-indigo-100 hover:text-white hover:underline text-sm"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signin?callbackUrl=/marketplace/new" 
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <span className="mr-1">+</span> Post Item
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pb-2 border-t border-indigo-500 pt-2">
            <nav className="flex flex-col space-y-2">
              {session ? (
                <>
                  <div className="text-sm text-indigo-100 py-1">
                    Welcome, {session.user?.name?.split(' ')[0] || 'User'}
                  </div>
                  <Link 
                    href="/marketplace/my-items" 
                    className="text-indigo-100 hover:text-white py-1 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Items
                  </Link>
                </>
              ) : (
                <Link 
                  href="/auth/signin?callbackUrl=/" 
                  className="text-indigo-100 hover:text-white py-1 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 