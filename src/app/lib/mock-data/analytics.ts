export type MetricCard = {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
};

export type ChartData = {
  date: string;
  listings: number;
  users: number;
  transactions: number;
};

export const mockMetricCards: MetricCard[] = [
  {
    title: 'Total Users',
    value: 12458,
    change: 12.5,
    trend: 'up',
    description: 'Total registered users',
  },
  {
    title: 'Active Listings',
    value: 3254,
    change: 8.2,
    trend: 'up',
    description: 'Currently active listings',
  },
  {
    title: 'Completed Transactions',
    value: 1876,
    change: 5.3,
    trend: 'up',
    description: 'Successfully completed transactions',
  },
  {
    title: 'Flagged Content',
    value: 42,
    change: -15.8,
    trend: 'down',
    description: 'Content flagged for review',
  },
  {
    title: 'Average Response Time',
    value: 3.2,
    change: -10.5,
    trend: 'down',
    description: 'Average response time in hours',
  },
  {
    title: 'User Satisfaction',
    value: 4.8,
    change: 2.1,
    trend: 'up',
    description: 'Average rating out of 5',
  },
];

export const mockChartData: ChartData[] = [
  { date: '2023-01', listings: 2100, users: 8500, transactions: 950 },
  { date: '2023-02', listings: 2300, users: 9200, transactions: 1050 },
  { date: '2023-03', listings: 2450, users: 10100, transactions: 1200 },
  { date: '2023-04', listings: 2800, users: 11300, transactions: 1450 },
  { date: '2023-05', listings: 3254, users: 12458, transactions: 1876 },
];

export const mockCategoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 20 },
  { name: 'Housing', value: 15 },
  { name: 'Vehicles', value: 10 },
  { name: 'Services', value: 8 },
  { name: 'Furniture', value: 7 },
  { name: 'Other', value: 5 },
];

export const mockLocationData = [
  { name: 'San Francisco', value: 40 },
  { name: 'Los Angeles', value: 25 },
  { name: 'San Jose', value: 15 },
  { name: 'Oakland', value: 10 },
  { name: 'Palo Alto', value: 5 },
  { name: 'Other', value: 5 },
];

export const mockDailyActiveUsers = [
  { date: '2023-05-01', users: 1250 },
  { date: '2023-05-02', users: 1300 },
  { date: '2023-05-03', users: 1275 },
  { date: '2023-05-04', users: 1350 },
  { date: '2023-05-05', users: 1400 },
  { date: '2023-05-06', users: 1200 },
  { date: '2023-05-07', users: 1150 },
  { date: '2023-05-08', users: 1325 },
  { date: '2023-05-09', users: 1375 },
  { date: '2023-05-10', users: 1425 },
  { date: '2023-05-11', users: 1450 },
  { date: '2023-05-12', users: 1500 },
  { date: '2023-05-13', users: 1350 },
  { date: '2023-05-14', users: 1300 },
  { date: '2023-05-15', users: 1425 },
]; 