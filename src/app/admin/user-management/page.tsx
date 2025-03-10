"use client";

import { useState } from "react";
import { mockUsers, User, UserRole } from "../../lib/mock-data/users";
import { format } from "date-fns";
import { 
  Search, 
  UserCog, 
  Users, 
  UserCheck, 
  UserX, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const activeUsers = users.filter((user) => user.status === "active");
  const suspendedUsers = users.filter((user) => user.status === "suspended");
  const inactiveUsers = users.filter((user) => user.status === "inactive");

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const UserTable = ({ items }: { items: User[] }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verification
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            items.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone || "No phone"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === "active" ? "bg-emerald-100 text-emerald-800" : 
                      user.status === "suspended" ? "bg-rose-100 text-rose-800" : 
                      "bg-gray-100 text-gray-800"}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.verificationLevel === "full" ? "bg-emerald-100 text-emerald-800" : 
                      user.verificationLevel === "id" ? "bg-indigo-100 text-indigo-800" : 
                      user.verificationLevel === "phone" ? "bg-amber-100 text-amber-800" : 
                      "bg-gray-100 text-gray-800"}`}>
                    {user.verificationLevel.charAt(0).toUpperCase() + user.verificationLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.listingCount} listings</div>
                  <div className="text-sm text-gray-500">Last active: {format(user.lastActive, "MMM d, yyyy")}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.status === "active" ? (
                    <button
                      onClick={() => handleStatusChange(user.id, "suspended")}
                      className="text-rose-600 hover:text-rose-900 font-medium"
                    >
                      Suspend
                    </button>
                  ) : user.status === "suspended" ? (
                    <button
                      onClick={() => handleStatusChange(user.id, "active")}
                      className="text-emerald-600 hover:text-emerald-900 font-medium"
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(user.id, "active")}
                      className="text-emerald-600 hover:text-emerald-900 font-medium"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="px-8 py-6 md:flex md:items-center md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
            <p className="text-indigo-100">
              Manage user accounts, roles, and permissions across the platform
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </button>
            <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
              <UserCog className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
        <div className="bg-indigo-900 bg-opacity-20 px-8 py-3">
          <div className="flex items-center text-sm text-indigo-100">
            <span className="font-medium">Quick Tip:</span>
            <span className="ml-2">Use the filters to quickly find specific users by role or status.</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md"
                  placeholder="Name, email, or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole | "all")}
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-indigo-50 mr-4">
              <UserCheck className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-rose-50 mr-4">
              <UserX className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspended Users</p>
              <p className="text-2xl font-bold text-gray-900">{suspendedUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-amber-50 mr-4">
              <Shield className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verification Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((users.filter(u => u.verificationLevel === "full").length / users.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            className="px-6 py-4 text-sm font-medium transition-colors flex items-center text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50"
          >
            <Users className="h-4 w-4 mr-2" />
            All Users
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {filteredUsers.length}
            </span>
          </button>
          <button
            className="px-6 py-4 text-sm font-medium transition-colors flex items-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Active
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {activeUsers.length}
            </span>
          </button>
          <button
            className="px-6 py-4 text-sm font-medium transition-colors flex items-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
          >
            <UserX className="h-4 w-4 mr-2" />
            Suspended
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {suspendedUsers.length}
            </span>
          </button>
          <button
            className="px-6 py-4 text-sm font-medium transition-colors flex items-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Inactive
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {inactiveUsers.length}
            </span>
          </button>
          <div className="ml-auto flex items-center pr-4">
            <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <UserTable items={filteredUsers} />
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> users
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
      </div>
    </div>
  );
} 