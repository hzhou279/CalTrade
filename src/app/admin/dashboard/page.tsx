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
  UserCog,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Bell
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { mockMetricCards } from "../../lib/mock-data/analytics";
import { getPendingListings, getFlaggedListings } from "../../lib/mock-data/listings";
import { getSuspendedUsers, getActiveUsers, getInactiveUsers } from "../../lib/mock-data/users";
import { cn } from "../../lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-full",
          color === "blue" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
          color === "green" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
          color === "amber" && "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
          color === "red" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center pt-1 text-xs">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : trend === "down" ? (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          ) : null}
          <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}>
            {trendValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

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
      description: "Active platform users",
      trend: "up" as const,
      trendValue: "+12.5% from last month",
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Listings",
      value: pendingListings.length + 15, // Adding some fake approved listings
      description: "Current marketplace items",
      trend: "up" as const,
      trendValue: "+8.2% from last month",
      icon: ShoppingBag,
      color: "green"
    },
    {
      title: "Pending Approvals",
      value: pendingListings.length,
      description: "Items awaiting review",
      trend: "down" as const,
      trendValue: "-3.1% from last month",
      icon: Clock,
      color: "amber"
    },
    {
      title: "Flagged Content",
      value: flaggedListings.length,
      description: "Items reported by users",
      trend: "down" as const,
      trendValue: "-15.8% from last month",
      icon: AlertTriangle,
      color: "red"
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: {
        name: "System",
        initials: "SY",
      },
      action: "New listing flagged: Concert Tickets - Taylor Swift reported 5 times",
      time: "30 minutes ago",
      status: "pending" as const,
    },
    {
      id: 2,
      user: {
        name: "Admin",
        initials: "AD",
      },
      action: "User account suspended: David Wu (user5) - Multiple policy violations",
      time: "2 hours ago",
      status: "completed" as const,
    },
    {
      id: 3,
      user: {
        name: "Admin",
        initials: "AD",
      },
      action: "New moderator added: Michael Zhang (user3) - Role changed to moderator",
      time: "1 day ago",
      status: "completed" as const,
    },
    ...pendingListings.slice(0, 2).map((listing, index) => ({
      id: 4 + index,
      user: {
        name: listing.userName,
        initials: listing.userName.split(' ').map(n => n[0]).join(''),
      },
      action: `New listing created: ${listing.title}`,
      time: "Today",
      status: "pending" as const,
    })),
    ...flaggedListings.slice(0, 2).map((listing, index) => ({
      id: 6 + index,
      user: {
        name: "User Report",
        initials: "UR",
      },
      action: `Content flagged: ${listing.title} (${listing.reportCount} reports)`,
      time: "This week",
      status: "pending" as const,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of platform activity and pending actions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard 
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.trend}
                trendValue={stat.trendValue}
                color={stat.color}
              />
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Activity Feed */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and events on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{item.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{item.user.name}</p>
                            <span className="text-xs text-muted-foreground">{item.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.action}</p>
                          {item.status && (
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="mt-1"
                            >
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Action Items */}
            <div className="col-span-3 space-y-4">
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/admin/content-moderation">Review All</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Breakdown of user account status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <PieChart className="h-40 w-40 text-muted-foreground/60" />
                  <div className="absolute space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                        Active
                      </span>
                      <span>{activeUsers.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="mr-1 h-2 w-2 rounded-full bg-amber-500"></span>
                        Inactive
                      </span>
                      <span>{inactiveUsers.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span>
                        Suspended
                      </span>
                      <span>{suspendedUsers.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMetricCards.slice(0, 4).map((metric, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{metric.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suspended Users */}
            <Card>
              <CardHeader>
                <CardTitle>Suspended Users</CardTitle>
                <CardDescription>
                  Recently suspended accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suspendedUsers.slice(0, 4).map((user) => (
                    <div key={user.id} className="flex items-start gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email || user.phone || "No contact info"}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/admin/user-management">Manage Users</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage all platform content from this tab
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Content management tools will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage all platform users from this tab
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">User management tools will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed platform analytics and reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <BarChart3 className="h-60 w-60 text-muted-foreground/60" />
              <span className="text-sm text-muted-foreground absolute">
                Analytics visualization
              </span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 