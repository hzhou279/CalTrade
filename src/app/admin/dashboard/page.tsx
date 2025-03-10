"use client";

import { Card, Metric, Text, Flex, ProgressBar } from "@tremor/react";
import { mockMetricCards } from "../../lib/mock-data/analytics";
import { getPendingListings, getFlaggedListings } from "../../lib/mock-data/listings";
import { getSuspendedUsers } from "../../lib/mock-data/users";
import Link from "next/link";

export default function AdminDashboard() {
  const pendingListings = getPendingListings();
  const flaggedListings = getFlaggedListings();
  const suspendedUsers = getSuspendedUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of platform activity and pending actions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockMetricCards.slice(0, 3).map((metric) => (
          <Card key={metric.title} className="max-w-xs mx-auto">
            <Text>{metric.title}</Text>
            <Metric>{metric.value.toLocaleString()}</Metric>
            <Flex className="mt-4">
              <Text>{metric.description}</Text>
              <Text
                className={
                  metric.trend === "up"
                    ? "text-emerald-500"
                    : metric.trend === "down"
                    ? "text-red-500"
                    : ""
                }
              >
                {metric.change > 0 ? "+" : ""}
                {metric.change}%
              </Text>
            </Flex>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending Listings */}
        <Card className="max-w-xs mx-auto">
          <Text>Pending Listings</Text>
          <Metric>{pendingListings.length}</Metric>
          <Flex className="mt-4">
            <Text>Awaiting review</Text>
            <Link
              href="/admin/content-moderation"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Review
            </Link>
          </Flex>
          <ProgressBar
            value={(pendingListings.length / 10) * 100}
            color="indigo"
            className="mt-3"
          />
        </Card>

        {/* Flagged Content */}
        <Card className="max-w-xs mx-auto">
          <Text>Flagged Content</Text>
          <Metric>{flaggedListings.length}</Metric>
          <Flex className="mt-4">
            <Text>Reported by users</Text>
            <Link
              href="/admin/content-moderation"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Review
            </Link>
          </Flex>
          <ProgressBar
            value={(flaggedListings.length / 10) * 100}
            color="amber"
            className="mt-3"
          />
        </Card>

        {/* Suspended Users */}
        <Card className="max-w-xs mx-auto">
          <Text>Suspended Users</Text>
          <Metric>{suspendedUsers.length}</Metric>
          <Flex className="mt-4">
            <Text>Account reviews</Text>
            <Link
              href="/admin/user-management"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Manage
            </Link>
          </Flex>
          <ProgressBar
            value={(suspendedUsers.length / 10) * 100}
            color="red"
            className="mt-3"
          />
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    New listing flagged
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      High Priority
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      "Concert Tickets - Taylor Swift" reported 5 times
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>30 minutes ago</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    User account suspended
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Medium Priority
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      David Wu (user5) - Multiple policy violations
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>2 hours ago</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    New moderator added
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      System Update
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Michael Zhang (user3) - Role changed to moderator
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>1 day ago</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 