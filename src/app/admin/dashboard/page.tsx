"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Package, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  User,
  UserX,
  UserCog,
  Activity,
  PieChart,
  Calendar,
  Settings,
  Shield,
  LayoutDashboard,
  Search,
  type LucideIcon
} from "lucide-react";

// Mock data functions with proper types
interface MockListing {
  id: string;
  title: string;
  date: Date;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  date?: Date;
}

const getPendingListings = (): MockListing[] => Array(7).fill(null).map((_, i) => ({ 
  id: `p${i}`, 
  title: `Pending Item ${i}`, 
  date: new Date(Date.now() - i * 86400000) 
}));

const getFlaggedListings = (): MockListing[] => Array(4).fill(null).map((_, i) => ({ 
  id: `f${i}`, 
  title: `Flagged Item ${i}`, 
  date: new Date(Date.now() - i * 86400000) 
}));

const getSuspendedUsers = (): MockUser[] => Array(3).fill(null).map((_, i) => ({ 
  id: `s${i}`, 
  name: `User ${i}`, 
  email: `suspended${i}@example.com`, 
  date: new Date(Date.now() - i * 86400000) 
}));

const getActiveUsers = (): MockUser[] => Array(20).fill(null).map((_, i) => ({ 
  id: `a${i}`, 
  name: `Active User ${i}`, 
  email: `active${i}@example.com` 
}));

const getInactiveUsers = (): MockUser[] => Array(5).fill(null).map((_, i) => ({ 
  id: `i${i}`, 
  name: `Inactive User ${i}`, 
  email: `inactive${i}@example.com` 
}));

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const pendingListings = getPendingListings();
  const flaggedListings = getFlaggedListings();
  const suspendedUsers = getSuspendedUsers();
  const activeUsers = getActiveUsers();
  const inactiveUsers = getInactiveUsers();

  return (
    <div>
      {/* Stats Grid */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-5 text-gray-800">Dashboard Overview</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="p-6 bg-white shadow-md hover:shadow-lg transition-all rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Total Users</h4>
                <p className="text-3xl font-bold text-gray-900">{activeUsers.length + suspendedUsers.length + inactiveUsers.length}</p>
                <p className="text-sm font-medium mt-1 text-green-600">+12.5%</p>
              </div>
              <div className="p-4 bg-indigo-100 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div className="p-6 bg-white shadow-md hover:shadow-lg transition-all rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Active Listings</h4>
                <p className="text-3xl font-bold text-gray-900">22</p>
                <p className="text-sm font-medium mt-1 text-green-600">+8.2%</p>
              </div>
              <div className="p-4 bg-emerald-100 rounded-lg">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="p-6 bg-white shadow-md hover:shadow-lg transition-all rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Pending Approvals</h4>
                <p className="text-3xl font-bold text-gray-900">{pendingListings.length}</p>
                <p className="text-sm font-medium mt-1 text-red-600">-3.1%</p>
              </div>
              <div className="p-4 bg-amber-100 rounded-lg">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Flagged Content */}
          <div className="p-6 bg-white shadow-md hover:shadow-lg transition-all rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Flagged Content</h4>
                <p className="text-3xl font-bold text-gray-900">{flaggedListings.length}</p>
                <p className="text-sm font-medium mt-1 text-red-600">-15.8%</p>
              </div>
              <div className="p-4 bg-rose-100 rounded-lg">
                <Flag className="w-8 h-8 text-rose-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Pending Approvals</h3>
            <Link href="/admin/content-moderation" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {pendingListings.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Submitted {item.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">User Statistics</h3>
            <Link href="/admin/user-management" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Manage users
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Active Users</span>
                </div>
                <span className="text-xl font-bold text-indigo-700">{activeUsers.length}</span>
              </div>
            </div>
            <div className="p-4 bg-rose-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <UserX className="h-5 w-5 text-rose-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Suspended Users</span>
                </div>
                <span className="text-xl font-bold text-rose-700">{suspendedUsers.length}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <UserCog className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Inactive Users</span>
                </div>
                <span className="text-xl font-bold text-gray-700">{inactiveUsers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Flagged Content</h3>
          <Link href="/admin/content-moderation" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-4">Item</th>
                <th className="pb-3 px-4">Date Flagged</th>
                <th className="pb-3 px-4">Reports</th>
                <th className="pb-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedListings.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-4">{item.title}</td>
                  <td className="py-4 px-4">{item.date.toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                      3 reports
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-3">
                      <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                        Review
                      </button>
                      <button className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200 transition-colors">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}