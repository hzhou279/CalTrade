"use client";

import { useState } from "react";
import { mockUsers, User, UserRole } from "../../lib/mock-data/users";
import { format } from "date-fns";
import { Card, Tab, TabList, TabGroup, TabPanel, TabPanels } from "@tremor/react";

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
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
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
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === "active" ? "bg-green-100 text-green-800" : 
                      user.status === "suspended" ? "bg-red-100 text-red-800" : 
                      "bg-gray-100 text-gray-800"}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.verificationLevel === "full" ? "bg-green-100 text-green-800" : 
                      user.verificationLevel === "id" ? "bg-blue-100 text-blue-800" : 
                      user.verificationLevel === "phone" ? "bg-yellow-100 text-yellow-800" : 
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
                      className="text-red-600 hover:text-red-900"
                    >
                      Suspend
                    </button>
                  ) : user.status === "suspended" ? (
                    <button
                      onClick={() => handleStatusChange(user.id, "active")}
                      className="text-green-600 hover:text-green-900"
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(user.id, "active")}
                      className="text-green-600 hover:text-green-900"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 shadow rounded-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Users
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Filter by Role
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

      {/* User Tabs */}
      <Card>
        <TabGroup>
          <TabList className="mb-6">
            <Tab>All Users ({filteredUsers.length})</Tab>
            <Tab>Active ({activeUsers.length})</Tab>
            <Tab>Suspended ({suspendedUsers.length})</Tab>
            <Tab>Inactive ({inactiveUsers.length})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserTable items={filteredUsers} />
            </TabPanel>
            <TabPanel>
              <UserTable items={activeUsers.filter(user => 
                (searchTerm === "" || 
                 user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedRole === "all" || user.role === selectedRole)
              )} />
            </TabPanel>
            <TabPanel>
              <UserTable items={suspendedUsers.filter(user => 
                (searchTerm === "" || 
                 user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedRole === "all" || user.role === selectedRole)
              )} />
            </TabPanel>
            <TabPanel>
              <UserTable items={inactiveUsers.filter(user => 
                (searchTerm === "" || 
                 user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedRole === "all" || user.role === selectedRole)
              )} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
} 