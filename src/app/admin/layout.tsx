"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Content Moderation", href: "/admin/content-moderation" },
  { name: "User Management", href: "/admin/user-management" },
  { name: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mr-4 text-gray-500 focus:outline-none focus:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <Link href="/admin/dashboard" className="text-xl font-bold text-indigo-600">
                  CalTrade Admin
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="/mock/users/admin.jpg"
                    alt="Admin user"
                  />
                  <span className="ml-2 text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } bg-white shadow-md w-64 min-h-screen`}
        >
          <div className="py-4">
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block py-2 px-4 text-sm ${
                        pathname === item.href
                          ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 