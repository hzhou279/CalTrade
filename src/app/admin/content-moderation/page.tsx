"use client";

import { useState, useEffect } from "react";
import { mockListings, Listing } from "../../lib/mock-data/listings";
import { format } from "date-fns";
import { Search, ShieldCheck, CheckCircle, XCircle, Filter, RefreshCw, AlertTriangle } from "lucide-react";

export default function ContentModerationPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setListings(mockListings);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (id: string) => {
    setListings(listings.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleReject = (id: string) => {
    setListings(listings.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleBulkApprove = () => {
    setListings(listings.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: 'approved' } : item
    ));
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setListings(listings.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: 'rejected' } : item
    ));
    setSelectedIds([]);
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getActiveListings = () => {
    switch (activeTab) {
      case 'Pending':
        return listings.filter(item => item.status === 'pending');
      case 'Approved':
        return listings.filter(item => item.status === 'approved');
      case 'Rejected':
        return listings.filter(item => item.status === 'rejected');
      default:
        return listings;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Moderation</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="px-8 py-6 md:flex md:items-center md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-2">Content Moderation</h1>
            <p className="text-indigo-100">
              Review and manage user-submitted content to maintain platform quality and safety
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white text-opacity-70" />
              </div>
              <input
                type="text"
                placeholder="Search listings..."
                className="pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-transparent focus:bg-white focus:border-indigo-300 text-white placeholder-white placeholder-opacity-70 focus:text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors w-full md:w-64"
              />
            </div>
            <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        <div className="bg-indigo-900 bg-opacity-20 px-8 py-3">
          <div className="flex items-center text-sm text-indigo-100">
            <span className="font-medium">Quick Tip:</span>
            <span className="ml-2">Use bulk actions to process multiple items at once.</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-amber-800">
                  {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center shadow-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve All
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors flex items-center shadow-sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {['Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Pending' && <AlertTriangle className="h-4 w-4 mr-2" />}
              {tab === 'Approved' && <CheckCircle className="h-4 w-4 mr-2" />}
              {tab === 'Rejected' && <XCircle className="h-4 w-4 mr-2" />}
              {tab}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                {listings.filter(item => item.status === tab.toLowerCase()).length}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center pr-4">
            <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getActiveListings().map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
              >
                {/* Listing Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-indigo-300">
                    {listing.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(listing.id)}
                      onChange={() => toggleSelectItem(listing.id)}
                      className="h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      listing.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      listing.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Posted by {listing.userName} • {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-700 mb-5 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(listing.id)}
                      className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(listing.id)}
                      className="flex-1 px-4 py-2 bg-rose-50 text-rose-700 text-sm font-medium rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors flex items-center justify-center"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {getActiveListings().length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-indigo-50 mb-4">
                <ShieldCheck className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} listings</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeTab === 'Pending' 
                  ? 'All content has been reviewed. Great job!' 
                  : `No ${activeTab.toLowerCase()} listings found.`}
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {getActiveListings().length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{getActiveListings().length}</span> items
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 