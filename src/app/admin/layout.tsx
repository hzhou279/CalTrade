"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "../components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Content Moderation", href: "/admin/content-moderation", icon: ShieldAlert },
  { name: "User Management", href: "/admin/user-management", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">CalTrade</span>
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative hidden md:flex">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-muted-foreground"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src="/mock/users/admin.jpg"
                  alt="Admin user"
                  className="h-8 w-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff`;
                  }}
                />
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 mt-16 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0"
          )}
        >
          <div className="flex h-[calc(100vh-4rem)] flex-col">
            <div className="flex-1 overflow-auto py-4 px-3">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <img
                  src="/mock/users/admin.jpg"
                  alt="Admin user"
                  className="h-9 w-9 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff`;
                  }}
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="truncate text-xs text-muted-foreground">admin@caltrade.com</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 