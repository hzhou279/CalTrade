export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
  location: string;
  reportCount: number;
  flaggedReason?: string;
};

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro - Like New',
    description: 'Selling my iPhone 13 Pro, only used for 3 months. Comes with original box and accessories.',
    price: 799,
    category: 'Electronics',
    images: ['/mock/iphone1.jpg', '/mock/iphone2.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-15T10:30:00'),
    updatedAt: new Date('2023-05-15T10:30:00'),
    userId: 'user1',
    userName: 'John Chen',
    location: 'San Francisco, CA',
    reportCount: 0,
  },
  {
    id: '2',
    title: 'Authentic Louis Vuitton Handbag',
    description: 'Selling my authentic Louis Vuitton handbag. Purchased in 2022.',
    price: 1200,
    category: 'Fashion',
    images: ['/mock/lv1.jpg', '/mock/lv2.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-14T15:45:00'),
    updatedAt: new Date('2023-05-14T15:45:00'),
    userId: 'user2',
    userName: 'Lisa Wang',
    location: 'Los Angeles, CA',
    reportCount: 2,
    flaggedReason: 'Potential counterfeit item',
  },
  {
    id: '3',
    title: 'Gaming PC - RTX 3080, i9 Processor',
    description: 'Custom built gaming PC with RTX 3080, i9 processor, 32GB RAM, 2TB SSD.',
    price: 1800,
    category: 'Electronics',
    images: ['/mock/pc1.jpg', '/mock/pc2.jpg'],
    status: 'approved',
    createdAt: new Date('2023-05-13T09:15:00'),
    updatedAt: new Date('2023-05-13T14:20:00'),
    userId: 'user3',
    userName: 'Michael Zhang',
    location: 'San Jose, CA',
    reportCount: 0,
  },
  {
    id: '4',
    title: 'Apartment for Rent - 2BR/2BA',
    description: 'Beautiful 2BR/2BA apartment for rent in downtown. Available from June 1st.',
    price: 2500,
    category: 'Housing',
    images: ['/mock/apt1.jpg', '/mock/apt2.jpg', '/mock/apt3.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-12T11:30:00'),
    updatedAt: new Date('2023-05-12T11:30:00'),
    userId: 'user4',
    userName: 'Sarah Li',
    location: 'San Francisco, CA',
    reportCount: 1,
    flaggedReason: 'Potential scam - price too low for area',
  },
  {
    id: '5',
    title: 'Toyota Camry 2020 - Low Mileage',
    description: 'Selling my Toyota Camry 2020, only 15,000 miles. Excellent condition.',
    price: 22000,
    category: 'Vehicles',
    images: ['/mock/car1.jpg', '/mock/car2.jpg'],
    status: 'rejected',
    createdAt: new Date('2023-05-11T16:20:00'),
    updatedAt: new Date('2023-05-11T18:45:00'),
    userId: 'user5',
    userName: 'David Wu',
    location: 'Oakland, CA',
    reportCount: 3,
    flaggedReason: 'Stolen vehicle report',
  },
  {
    id: '6',
    title: 'Macbook Pro M1 - 16GB RAM',
    description: 'Selling my Macbook Pro with M1 chip, 16GB RAM, 512GB SSD. Purchased in 2022.',
    price: 1300,
    category: 'Electronics',
    images: ['/mock/mac1.jpg', '/mock/mac2.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-10T13:10:00'),
    updatedAt: new Date('2023-05-10T13:10:00'),
    userId: 'user6',
    userName: 'Emily Huang',
    location: 'Palo Alto, CA',
    reportCount: 0,
  },
  {
    id: '7',
    title: 'Professional Camera Kit - Sony A7III',
    description: 'Complete Sony A7III kit with 3 lenses, tripod, and accessories.',
    price: 2800,
    category: 'Electronics',
    images: ['/mock/camera1.jpg', '/mock/camera2.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-09T10:05:00'),
    updatedAt: new Date('2023-05-09T10:05:00'),
    userId: 'user7',
    userName: 'Kevin Zhao',
    location: 'San Francisco, CA',
    reportCount: 0,
  },
  {
    id: '8',
    title: 'Dining Table with 6 Chairs',
    description: 'Solid wood dining table with 6 matching chairs. Great condition.',
    price: 650,
    category: 'Furniture',
    images: ['/mock/table1.jpg', '/mock/table2.jpg'],
    status: 'approved',
    createdAt: new Date('2023-05-08T14:30:00'),
    updatedAt: new Date('2023-05-08T16:15:00'),
    userId: 'user8',
    userName: 'Jessica Lin',
    location: 'Fremont, CA',
    reportCount: 0,
  },
  {
    id: '9',
    title: 'Concert Tickets - Taylor Swift',
    description: '2 tickets for Taylor Swift concert on June 15th at Levi\'s Stadium.',
    price: 450,
    category: 'Tickets',
    images: ['/mock/ticket1.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-07T09:45:00'),
    updatedAt: new Date('2023-05-07T09:45:00'),
    userId: 'user9',
    userName: 'Amanda Chen',
    location: 'Santa Clara, CA',
    reportCount: 5,
    flaggedReason: 'Potential scalping - price much higher than face value',
  },
  {
    id: '10',
    title: 'Tutoring Services - Math & Science',
    description: 'Experienced tutor offering math and science tutoring for high school and college students.',
    price: 50,
    category: 'Services',
    images: ['/mock/tutor1.jpg'],
    status: 'pending',
    createdAt: new Date('2023-05-06T11:20:00'),
    updatedAt: new Date('2023-05-06T11:20:00'),
    userId: 'user10',
    userName: 'Robert Tan',
    location: 'Berkeley, CA',
    reportCount: 0,
  },
];

export const getPendingListings = () => {
  return mockListings.filter(listing => listing.status === 'pending');
};

export const getApprovedListings = () => {
  return mockListings.filter(listing => listing.status === 'approved');
};

export const getRejectedListings = () => {
  return mockListings.filter(listing => listing.status === 'rejected');
};

export const getFlaggedListings = () => {
  return mockListings.filter(listing => listing.reportCount > 0);
};

export const getListingById = (id: string) => {
  return mockListings.find(listing => listing.id === id);
}; 