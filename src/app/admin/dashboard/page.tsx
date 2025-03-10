"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  User,
  UserX,
  UserCog
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { mockMetricCards } from "../../lib/mock-data/analytics";
import { getPendingListings, getFlaggedListings } from "../../lib/mock-data/listings";
import { getSuspendedUsers, getActiveUsers, getInactiveUsers } from "../../lib/mock-data/users";
import { cn } from "../../lib/utils";

export default function AdminDashboard() {
  const pendingListings = getPendingListings();
  const flaggedListings = getFlaggedListings();
  const suspendedUsers = getSuspendedUsers();
  const activeUsers = getActiveUsers();
  const inactiveUsers = getInactiveUsers();

  const stats = [
    {
      title: "Total Users",
      value: activeUsers.length + suspendedUsers.length + inactiveUsers.length,
      change: 12.5,
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Listings",
      value: pendingListings.length + 15, // Adding some fake approved listings
      change: 8.2,
      trend: "up",
      icon: ShoppingBag,
      color: "green"
    },
    {
      title: "Pending Approvals",
      value: pendingListings.length,
      change: -3.1,
      trend: "down",
      icon: Clock,
      color: "amber"
    },
    {
      title: "Flagged Content",
      value: flaggedListings.length,
      change: -15.8,
      trend: "down",
      icon: AlertTriangle,
      color: "red"
    },
  ];

  const recentActivity = [
    {
      title: "New listing flagged",
      description: "Concert Tickets - Taylor Swift reported 5 times",
      time: "30 minutes ago",
      priority: "high",
      icon: Flag,
    },
    {
      title: "User account suspended",
      description: "David Wu (user5) - Multiple policy violations",
      time: "2 hours ago",
      priority: "medium",
      icon: UserX,
    },
    {
      title: "New moderator added",
      description: "Michael Zhang (user3) - Role changed to moderator",
      time: "1 day ago",
      priority: "low",
      icon: UserCog,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform activity and pending actions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn(
                "p-2 rounded-full",
                stat.color === "blue" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                stat.color === "green" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                stat.color === "amber" && "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                stat.color === "red" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
              )}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change > 0 ? "+" : ""}{stat.change}%
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pending Listings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Listings</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {pendingListings.length} items
              </Badge>
            </div>
            <CardDescription>Listings awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="space-y-4">
              {pendingListings.slice(0, 3).map((listing) => (
                <div key={listing.id} className="flex items-start gap-2">
                  <div className="h-9 w-9 rounded bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">{listing.userName}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pendingListings.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  + {pendingListings.length - 3} more items
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/content-moderation">View All</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Flagged Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Flagged Content</CardTitle>
              <Badge variant="destructive" className="text-xs">
                {flaggedListings.length} reports
              </Badge>
            </div>
            <CardDescription>Content reported by users</CardDescription>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="space-y-4">
              {flaggedListings.slice(0, 3).map((listing) => (
                <div key={listing.id} className="flex items-start gap-2">
                  <div className="h-9 w-9 rounded bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Flag className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.reportCount} {listing.reportCount === 1 ? "report" : "reports"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {listing.status}
                  </Badge>
                </div>
              ))}
              {flaggedListings.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  + {flaggedListings.length - 3} more items
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/content-moderation">Review All</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Suspended Users */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Suspended Users</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {suspendedUsers.length} users
              </Badge>
            </div>
            <CardDescription>Account reviews</CardDescription>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="space-y-4">
              {suspendedUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-start gap-2">
                  <div className="h-9 w-9 rounded-full bg-muted overflow-hidden">
                    <img 
                      src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                      alt={user.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.reportCount} {user.reportCount === 1 ? "report" : "reports"}
                  </Badge>
                </div>
              ))}
              {suspendedUsers.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  + {suspendedUsers.length - 3} more users
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/user-management">Manage Users</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                <div className={cn(
                  "p-2 rounded-full",
                  activity.priority === "high" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                  activity.priority === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                  activity.priority === "low" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                )}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Badge variant={
                      activity.priority === "high" ? "destructive" : 
                      activity.priority === "medium" ? "warning" : 
                      "success"
                    } className="text-xs">
                      {activity.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 