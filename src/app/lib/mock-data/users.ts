export type UserRole = 'user' | 'moderator' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  lastActive: Date;
  location: string;
  listingCount: number;
  reportCount: number;
  verificationLevel: 'none' | 'phone' | 'id' | 'full';
};

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Chen',
    email: 'john.chen@example.com',
    phone: '+14155551234',
    image: '/mock/users/user1.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    lastActive: new Date('2023-05-15T10:30:00'),
    location: 'San Francisco, CA',
    listingCount: 12,
    reportCount: 0,
    verificationLevel: 'phone',
  },
  {
    id: 'user2',
    name: 'Lisa Wang',
    email: 'lisa.wang@example.com',
    phone: '+14155552345',
    image: '/mock/users/user2.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-02-20'),
    lastActive: new Date('2023-05-14T15:45:00'),
    location: 'Los Angeles, CA',
    listingCount: 8,
    reportCount: 1,
    verificationLevel: 'full',
  },
  {
    id: 'user3',
    name: 'Michael Zhang',
    email: 'michael.zhang@example.com',
    phone: '+14155553456',
    image: '/mock/users/user3.jpg',
    role: 'moderator',
    status: 'active',
    createdAt: new Date('2022-11-10'),
    lastActive: new Date('2023-05-13T09:15:00'),
    location: 'San Jose, CA',
    listingCount: 5,
    reportCount: 0,
    verificationLevel: 'id',
  },
  {
    id: 'user4',
    name: 'Sarah Li',
    email: 'sarah.li@example.com',
    phone: '+14155554567',
    image: '/mock/users/user4.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-03-05'),
    lastActive: new Date('2023-05-12T11:30:00'),
    location: 'San Francisco, CA',
    listingCount: 3,
    reportCount: 0,
    verificationLevel: 'phone',
  },
  {
    id: 'user5',
    name: 'David Wu',
    email: 'david.wu@example.com',
    phone: '+14155555678',
    image: '/mock/users/user5.jpg',
    role: 'user',
    status: 'suspended',
    createdAt: new Date('2022-12-18'),
    lastActive: new Date('2023-05-11T16:20:00'),
    location: 'Oakland, CA',
    listingCount: 15,
    reportCount: 4,
    verificationLevel: 'none',
  },
  {
    id: 'user6',
    name: 'Emily Huang',
    email: 'emily.huang@example.com',
    phone: '+14155556789',
    image: '/mock/users/user6.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-04-02'),
    lastActive: new Date('2023-05-10T13:10:00'),
    location: 'Palo Alto, CA',
    listingCount: 2,
    reportCount: 0,
    verificationLevel: 'full',
  },
  {
    id: 'user7',
    name: 'Kevin Zhao',
    email: 'kevin.zhao@example.com',
    phone: '+14155557890',
    image: '/mock/users/user7.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-01-30'),
    lastActive: new Date('2023-05-09T10:05:00'),
    location: 'San Francisco, CA',
    listingCount: 7,
    reportCount: 0,
    verificationLevel: 'phone',
  },
  {
    id: 'user8',
    name: 'Jessica Lin',
    email: 'jessica.lin@example.com',
    phone: '+14155558901',
    image: '/mock/users/user8.jpg',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2022-10-25'),
    lastActive: new Date('2023-03-08T14:30:00'),
    location: 'Fremont, CA',
    listingCount: 4,
    reportCount: 0,
    verificationLevel: 'none',
  },
  {
    id: 'user9',
    name: 'Amanda Chen',
    email: 'amanda.chen@example.com',
    phone: '+14155559012',
    image: '/mock/users/user9.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-02-12'),
    lastActive: new Date('2023-05-07T09:45:00'),
    location: 'Santa Clara, CA',
    listingCount: 9,
    reportCount: 2,
    verificationLevel: 'phone',
  },
  {
    id: 'user10',
    name: 'Robert Tan',
    email: 'robert.tan@example.com',
    phone: '+14155550123',
    image: '/mock/users/user10.jpg',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-03-20'),
    lastActive: new Date('2023-05-06T11:20:00'),
    location: 'Berkeley, CA',
    listingCount: 1,
    reportCount: 0,
    verificationLevel: 'id',
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@caltrade.com',
    phone: '+14155551111',
    image: '/mock/users/admin.jpg',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2022-01-01'),
    lastActive: new Date('2023-05-15T12:00:00'),
    location: 'San Francisco, CA',
    listingCount: 0,
    reportCount: 0,
    verificationLevel: 'full',
  },
];

export const getActiveUsers = () => {
  return mockUsers.filter(user => user.status === 'active');
};

export const getSuspendedUsers = () => {
  return mockUsers.filter(user => user.status === 'suspended');
};

export const getInactiveUsers = () => {
  return mockUsers.filter(user => user.status === 'inactive');
};

export const getAdmins = () => {
  return mockUsers.filter(user => user.role === 'admin');
};

export const getModerators = () => {
  return mockUsers.filter(user => user.role === 'moderator');
};

export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
}; 