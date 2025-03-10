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

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform performance metrics and insights
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 shadow rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockMetricCards.map((metric) => (
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

      {/* Main Charts */}
      <TabGroup>
        <TabList className="mb-6">
          <Tab>Overview</Tab>
          <Tab>User Activity</Tab>
          <Tab>Content</Tab>
          <Tab>Transactions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Growth Trends */}
              <Card>
                <Title>Platform Growth</Title>
                <Text>Monthly trends for key metrics</Text>
                <AreaChart
                  className="mt-4 h-80"
                  data={mockChartData}
                  index="date"
                  categories={["users", "listings", "transactions"]}
                  colors={["indigo", "cyan", "emerald"]}
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              </Card>

              {/* Category Distribution */}
              <Card>
                <Title>Category Distribution</Title>
                <Text>Listings by category</Text>
                <DonutChart
                  className="mt-4 h-80"
                  data={mockCategoryData}
                  category="value"
                  index="name"
                  colors={["indigo", "cyan", "emerald", "violet", "amber", "rose", "slate"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Daily Active Users */}
              <Card>
                <Title>Daily Active Users</Title>
                <Text>Last 15 days</Text>
                <AreaChart
                  className="mt-4 h-80"
                  data={mockDailyActiveUsers}
                  index="date"
                  categories={["users"]}
                  colors={["indigo"]}
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              </Card>

              {/* User Location */}
              <Card>
                <Title>User Distribution</Title>
                <Text>By location</Text>
                <BarChart
                  className="mt-4 h-80"
                  data={mockLocationData}
                  index="name"
                  categories={["value"]}
                  colors={["indigo"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Content Status */}
              <Card>
                <Title>Content Status</Title>
                <Text>Distribution of listing statuses</Text>
                <DonutChart
                  className="mt-4 h-80"
                  data={[
                    { name: "Active", value: 65 },
                    { name: "Pending", value: 20 },
                    { name: "Sold", value: 10 },
                    { name: "Rejected", value: 5 },
                  ]}
                  category="value"
                  index="name"
                  colors={["emerald", "amber", "blue", "red"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </Card>

              {/* Content Quality */}
              <Card>
                <Title>Content Quality</Title>
                <Text>Reported content over time</Text>
                <AreaChart
                  className="mt-4 h-80"
                  data={[
                    { date: "2023-01", reports: 12 },
                    { date: "2023-02", reports: 15 },
                    { date: "2023-03", reports: 10 },
                    { date: "2023-04", reports: 8 },
                    { date: "2023-05", reports: 5 },
                  ]}
                  index="date"
                  categories={["reports"]}
                  colors={["red"]}
                  valueFormatter={(value) => `${value}`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Transaction Volume */}
              <Card>
                <Title>Transaction Volume</Title>
                <Text>Monthly transaction count</Text>
                <BarChart
                  className="mt-4 h-80"
                  data={mockChartData}
                  index="date"
                  categories={["transactions"]}
                  colors={["emerald"]}
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              </Card>

              {/* Transaction Value */}
              <Card>
                <Title>Transaction Value</Title>
                <Text>Estimated monthly GMV ($)</Text>
                <AreaChart
                  className="mt-4 h-80"
                  data={[
                    { date: "2023-01", value: 95000 },
                    { date: "2023-02", value: 105000 },
                    { date: "2023-03", value: 120000 },
                    { date: "2023-04", value: 145000 },
                    { date: "2023-05", value: 187600 },
                  ]}
                  index="date"
                  categories={["value"]}
                  colors={["indigo"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <Title>Conversion Rate</Title>
            <Metric>8.2%</Metric>
            <Text>Visitors who complete a transaction</Text>
            <ProgressBar value={8.2} color="indigo" className="mt-3" />
          </Card>
          <Card>
            <Title>User Retention</Title>
            <Metric>76%</Metric>
            <Text>30-day retention rate</Text>
            <ProgressBar value={76} color="emerald" className="mt-3" />
          </Card>
        </div>
      </div>
    </div>
  );
} 