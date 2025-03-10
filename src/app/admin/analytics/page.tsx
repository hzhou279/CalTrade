"use client";

import { useState } from "react";
import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Metric,
  Flex,
  ProgressBar,
  AreaChart,
  BarChart,
  DonutChart,
} from "@tremor/react";
import {
  mockMetricCards,
  mockChartData,
  mockCategoryData,
  mockLocationData,
  mockDailyActiveUsers,
} from "../../lib/mock-data/analytics";
import { 
  Calendar, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag,
  Activity,
  Filter
} from "lucide-react";

// Custom styles to replace Tremor CSS
const cardStyle = "bg-white border border-gray-100 rounded-xl p-6 shadow-sm";
const metricStyle = "text-3xl font-semibold text-gray-900 mt-2";
const textStyle = "text-sm text-gray-500";
const titleStyle = "text-lg font-medium text-gray-900";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="px-8 py-6 md:flex md:items-center md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-indigo-100">
              Monitor platform performance and gain insights from user activity
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange === "7d" ? "Last 7 days" : 
               dateRange === "30d" ? "Last 30 days" : 
               dateRange === "90d" ? "Last 90 days" : "Last year"}
            </button>
            <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
        <div className="bg-indigo-900 bg-opacity-20 px-8 py-3">
          <div className="flex items-center text-sm text-indigo-100">
            <span className="font-medium">Quick Tip:</span>
            <span className="ml-2">Change the date range to see how metrics evolve over different time periods.</span>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="dateRange"
                  name="dateRange"
                  className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {mockMetricCards.map((metric) => {
          const Icon = metric.trend === "up" ? TrendingUp : TrendingDown;
          const iconColor = metric.trend === "up" ? "text-emerald-500" : "text-rose-500";
          const bgColor = metric.trend === "up" ? "bg-emerald-50" : "bg-rose-50";
          
          return (
            <div key={metric.title} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className={textStyle}>{metric.title}</p>
                  <div className={`p-2 rounded-full ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                </div>
                <p className={metricStyle}>{metric.value.toLocaleString()}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className={textStyle}>{metric.description}</p>
                  <p
                    className={
                      metric.trend === "up"
                        ? "text-emerald-500 text-sm font-medium"
                        : "text-rose-500 text-sm font-medium"
                    }
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </p>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={
                      metric.trend === "up"
                        ? "bg-emerald-500 h-1.5 rounded-full"
                        : "bg-rose-500 h-1.5 rounded-full"
                    }
                    style={{ width: `${Math.abs(metric.change)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
              activeTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50"
                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
              activeTab === "users"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50"
                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            User Activity
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
              activeTab === "content"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50"
                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
            }`}
            onClick={() => setActiveTab("content")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Content
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
              activeTab === "transactions"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50"
                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-30"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Transactions
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Growth Trends */}
              <div className={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={titleStyle}>Platform Growth</h3>
                    <p className={textStyle}>Monthly trends for key metrics</p>
                  </div>
                  <div className="p-2 rounded-full bg-indigo-50">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
                <div className="mt-4 h-80">
                  <AreaChart
                    className="h-full"
                    data={mockChartData}
                    index="date"
                    categories={["users", "listings", "transactions"]}
                    colors={["indigo", "cyan", "emerald"]}
                    valueFormatter={(value) => `${value.toLocaleString()}`}
                  />
                </div>
              </div>

              {/* Category Distribution */}
              <div className={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={titleStyle}>Category Distribution</h3>
                    <p className={textStyle}>Listings by category</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-50">
                    <PieChart className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <div className="mt-4 h-80">
                  <DonutChart
                    className="h-full"
                    data={mockCategoryData}
                    category="value"
                    index="name"
                    colors={["indigo", "cyan", "emerald", "violet", "amber", "rose", "slate"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "users" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Daily Active Users */}
              <div className={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={titleStyle}>Daily Active Users</h3>
                    <p className={textStyle}>User engagement over time</p>
                  </div>
                  <div className="p-2 rounded-full bg-indigo-50">
                    <Users className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
                <div className="mt-4 h-80">
                  <BarChart
                    className="h-full"
                    data={mockDailyActiveUsers}
                    index="date"
                    categories={["users"]}
                    colors={["indigo"]}
                    valueFormatter={(value) => `${value.toLocaleString()}`}
                  />
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={titleStyle}>Geographic Distribution</h3>
                    <p className={textStyle}>Top user locations</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {mockLocationData.map((location) => (
                    <div key={location.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{location.name}</span>
                        <span className="text-sm font-medium text-gray-700">{location.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${location.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === "content" || activeTab === "transactions") && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-indigo-50 mb-4">
                {activeTab === "content" ? 
                  <ShoppingBag className="h-8 w-8 text-indigo-500" /> : 
                  <Activity className="h-8 w-8 text-indigo-500" />
                }
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activeTab === "content" ? "Content Analytics" : "Transaction Analytics"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {activeTab === "content" 
                  ? "Detailed analytics about content performance and engagement." 
                  : "Comprehensive data about platform transactions and revenue."}
              </p>
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                View Detailed Report
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Performance Metrics</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white border border-gray-100 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-900">Conversion Rate</h3>
              <div className="p-1.5 rounded-full bg-emerald-50">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">8.2%</p>
            <p className="text-sm text-gray-500 mt-1 mb-3">Visitors who complete a transaction</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '8.2%' }}></div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-900">User Retention</h3>
              <div className="p-1.5 rounded-full bg-emerald-50">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">76%</p>
            <p className="text-sm text-gray-500 mt-1 mb-3">30-day retention rate</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 