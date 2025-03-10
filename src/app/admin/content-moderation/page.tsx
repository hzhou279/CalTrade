"use client";

import { useState } from "react";
import { mockListings, Listing } from "../../lib/mock-data/listings";
import { format } from "date-fns";
import { Card, Tab, TabList, TabGroup, TabPanel, TabPanels } from "@tremor/react";

export default function ContentModerationPage() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pendingListings = listings.filter((listing) => listing.status === "pending");
  const flaggedListings = listings.filter((listing) => listing.reportCount > 0);
  const approvedListings = listings.filter((listing) => listing.status === "approved");
  const rejectedListings = listings.filter((listing) => listing.status === "rejected");

  const handleApprove = (id: string) => {
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, status: "approved" } : listing
      )
    );
  };

  const handleReject = (id: string) => {
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, status: "rejected" } : listing
      )
    );
  };

  const handleBulkApprove = () => {
    setListings(
      listings.map((listing) =>
        selectedIds.includes(listing.id)
          ? { ...listing, status: "approved" }
          : listing
      )
    );
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setListings(
      listings.map((listing) =>
        selectedIds.includes(listing.id)
          ? { ...listing, status: "rejected" }
          : listing
      )
    );
    setSelectedIds([]);
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = (items: Listing[]) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const ListingTable = ({ items, showActions = true }: { items: Listing[], showActions?: boolean }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={() => toggleSelectAll(items)}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listing
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reports
            </th>
            {showActions && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                No listings found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.images.length > 0 && (
                      <div className="flex-shrink-0 h-10 w-10 mr-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.userName}</div>
                  <div className="text-sm text-gray-500">{item.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(item.createdAt, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.status === "approved" ? "bg-green-100 text-green-800" : 
                      item.status === "rejected" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.reportCount > 0 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {item.reportCount} {item.reportCount === 1 ? "report" : "reports"}
                    </span>
                  ) : (
                    "None"
                  )}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage listings across the platform
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"} selected
            </span>
            <div>
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Card>
        <TabGroup>
          <TabList className="mb-6">
            <Tab>Pending ({pendingListings.length})</Tab>
            <Tab>Flagged ({flaggedListings.length})</Tab>
            <Tab>Approved ({approvedListings.length})</Tab>
            <Tab>Rejected ({rejectedListings.length})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ListingTable items={pendingListings} />
            </TabPanel>
            <TabPanel>
              <ListingTable items={flaggedListings} />
            </TabPanel>
            <TabPanel>
              <ListingTable items={approvedListings} showActions={false} />
            </TabPanel>
            <TabPanel>
              <ListingTable items={rejectedListings} showActions={false} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
} 