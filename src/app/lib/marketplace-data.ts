import { MarketplaceItem, MarketplaceCategory } from '../../types/marketplace';

// Helper function to generate descriptions of different lengths
const generateVariableLengthDescriptions = () => {
  const shortDescriptions = [
    'Barely used, in excellent condition.',
    'Great deal, must sell quickly!',
    'Perfect for students.',
    'No damage, works perfectly.',
    'Local pickup only.',
  ];

  const mediumDescriptions = [
    'Used for one semester only. No scratches or damage. Works perfectly and comes with original packaging.',
    'Purchased last year and barely used. Selling because I\'m upgrading. No issues whatsoever.',
    'Great condition with minor wear. Comes with all accessories and original box. Perfect for daily use.',
    'Like new condition. Only used a handful of times. Selling because I received another as a gift.',
    'Good condition with some normal wear. Everything functions perfectly. Great value for the price.',
  ];

  const longDescriptions = [
    'This item is in excellent condition and has been well-maintained. I purchased it about a year ago and have used it sparingly. There are no scratches, dents, or functional issues. It comes with all original accessories, packaging, and documentation. I\'m only selling because I recently upgraded to a newer model. This is perfect for students or anyone looking for a reliable product at a great price. Local pickup preferred but can arrange shipping if needed.',
    'Barely used and in like-new condition. I bought this for a project but ended up not needing it as much as I thought. It has been stored in a smoke-free, pet-free home and treated with care. All functions work perfectly, and it looks almost identical to when I first purchased it. The original warranty is still valid for another 8 months. I\'m including all accessories, manuals, and the original box. This is a fantastic opportunity to get a premium item at a significant discount from retail price.',
    'This item is in good condition with some normal signs of wear from regular use. Everything functions exactly as it should, and it has been well-maintained. I\'ve owned it for about two years and am only selling because I\'m moving out of state and trying to downsize. It comes with most of the original accessories (missing one small part as noted in photos). This model is known for its reliability and durability, and it should serve you well for years to come. Feel free to ask any questions or request additional photos.',
    'Perfect condition with absolutely no issues. I received this as a gift but already had one, so it has barely been used. All original packaging, accessories, and documentation are included. This is essentially the same as buying new but at a much better price. This model has excellent reviews and is considered one of the best in its category. Local pickup available in Berkeley area, or I can ship at buyer\'s expense. No returns, so please ask any questions before purchasing.',
    'This item shows some cosmetic wear but functions perfectly. I\'ve used it regularly for about three years, and it has been extremely reliable. There are a few minor scratches on the surface (shown in photos), but they don\'t affect performance at all. All essential accessories are included, though I no longer have the original box. This model is known for its durability and is perfect for someone who wants a quality product without paying full retail price. I\'m selling because I recently upgraded to a newer model. Can meet on campus or nearby for handoff.',
  ];

  const veryLongDescriptions = [
    'I purchased this item brand new approximately 18 months ago from the official store for full retail price. It has been used carefully and maintained according to manufacturer recommendations. The item is in excellent condition with only minimal signs of use that are barely noticeable. There are no functional issues whatsoever - everything works exactly as it should, and it performs just as well as when it was new. All original accessories are included, along with the original packaging, manual, warranty card, and receipt. I even purchased an extended protection plan that is transferable to the new owner and valid for another 2.5 years. I\'m only selling because I recently received an unexpected upgrade as a gift and no longer need this one. This particular model has consistently received excellent reviews and is considered one of the best in its category for reliability, performance, and value. It would be perfect for a student, professional, or anyone looking for a high-quality item at a significant discount from retail price. I\'m available for local pickup in the Berkeley area most weekdays after 4pm and weekends by arrangement. I can also ship at buyer\'s expense if preferred. Please feel free to ask any questions or request additional photos of specific details before purchasing.',
    'This item is in good used condition and has served me well for the past two years. As a Berkeley student, I\'ve used it regularly but always with care. There are some normal signs of wear from regular use, including a few minor scratches on the surface and slight wear on the edges (all shown clearly in the photos). None of these cosmetic issues affect the functionality in any way - everything works perfectly. The battery life is still excellent, maintaining about 90% of its original capacity. I recently had it professionally cleaned and inspected, and the technician confirmed it\'s in great working order with no issues. It comes with most of the original accessories, though I no longer have the box or manual. I can provide links to PDF versions of the documentation if needed. I\'m selling because I\'m graduating next month and upgrading to a different model that better suits my new job requirements. This would be perfect for another student or anyone looking for a reliable, mid-range option without paying full retail price. The current retail price for this model is $XXX, so this listing represents a significant savings. I\'m available for meetups on or near campus most afternoons. Cash or Venmo accepted. No returns, so please ask any questions before purchasing.',
    'I\'m selling my beloved item that I\'ve owned for just over a year. This is the premium model with all the extra features, which I purchased new for a significant price. It\'s in nearly perfect condition with only one very small scratch on the bottom that isn\'t visible during normal use (shown in the last photo). I\'ve always used a protective case (included) and treated it with extreme care. All functions work flawlessly, and it performs exactly as it did when new. Battery health is excellent at 96% of original capacity. The item has never been dropped, exposed to water, or damaged in any way. It comes with absolutely everything that was in the original package, including all accessories, cables, adapters, documentation, and the original box in good condition. I even have the original receipt and the remaining warranty is transferable (valid for another 10 months). I\'m including several premium accessories that I purchased separately, including an extra protective case, a high-quality carrying pouch, and a specialized cleaning kit (total value of extras is approximately $XX). I\'m only selling because I unexpectedly received the newer model as a graduation gift. This is an excellent opportunity to get a premium item in nearly new condition at a substantial discount. I\'m available for meetups in the Berkeley area, preferably on campus or at a public location. I can demonstrate all functions and answer any questions at the meetup. Payment via cash, Venmo, or PayPal only.',
    'This listing is for my gently used item that I purchased approximately 8 months ago. It\'s in excellent condition with no visible scratches, dents, or signs of wear. I\'ve always kept it in a protective case and treated it with the utmost care. All functions work perfectly, and it performs just as well as when it was new. The battery still holds a charge extremely well, lasting the full advertised duration. This is the higher-end model with expanded capacity and additional features compared to the base model. It comes with all original accessories, including the charger, cable, adapter, and manual. I also have the original box in perfect condition. I\'m including two additional accessories that I purchased separately: a premium protective case and a specialized stand (combined value of $XX). I\'m selling because I\'m transferring to another university out of state and trying to minimize what I need to ship. This would be perfect for another student or anyone looking for a high-quality item at a good price. The current retail price for this model is $XXX, so this represents a significant savings for an item in like-new condition. I\'m available for meetups on campus or nearby locations most weekdays after 3pm. I prefer cash or Venmo for payment. Feel free to message with any questions or to request additional photos of specific details.',
    'I\'m selling my item that I\'ve owned and enjoyed for about 3 years. It\'s in good used condition with some normal signs of wear from regular use. There are a few scratches on the surface and some wear on the corners (all shown in the photos), but these are purely cosmetic and don\'t affect functionality at all. Everything works exactly as it should, and it has been extremely reliable throughout my ownership. This model is known for its durability and longevity - many people use them for 5+ years without issues. I\'ve always maintained it according to manufacturer recommendations and had it professionally serviced once a year. It comes with most of the original accessories, though I no longer have the box. I\'m including a few extras that I purchased separately, including a protective case and a specialized cleaning kit. I\'m selling because I\'m graduating and have invested in a higher-end model for my professional work. This would be perfect for a student or anyone looking for a reliable, mid-range option at an affordable price. The equivalent new model currently sells for $XXX, so this is a great opportunity to save. I\'m available for meetups in the Berkeley area, preferably on campus. Cash or Venmo accepted. Please feel free to ask any questions before purchasing.',
  ];

  return {
    shortDescriptions,
    mediumDescriptions,
    longDescriptions,
    veryLongDescriptions,
    getRandomDescription: (length: 'short' | 'medium' | 'long' | 'veryLong') => {
      const random = Math.floor(Math.random() * 5);
      switch (length) {
        case 'short':
          return shortDescriptions[random];
        case 'medium':
          return mediumDescriptions[random];
        case 'long':
          return longDescriptions[random];
        case 'veryLong':
          return veryLongDescriptions[random];
        default:
          return mediumDescriptions[random];
      }
    }
  };
};

const descriptions = generateVariableLengthDescriptions();

export const marketplaceCategories: MarketplaceCategory[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Furniture', slug: 'furniture' },
  { id: '3', name: 'Clothing', slug: 'clothing' },
  { id: '4', name: 'Books', slug: 'books' },
  { id: '5', name: 'Sports', slug: 'sports' },
  { id: '6', name: 'Vehicles', slug: 'vehicles' },
  { id: '7', name: 'Toys & Games', slug: 'toys-games' },
  { id: '8', name: 'Home & Garden', slug: 'home-garden' },
  { id: '9', name: 'Audio', slug: 'audio' },
  { id: '10', name: 'Photography', slug: 'photography' },
  { id: '11', name: 'Accessories', slug: 'accessories' },
  { id: '12', name: 'Kitchen', slug: 'kitchen' },
];

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'MacBook Pro 16" 2021',
    description: descriptions.getRandomDescription('long'),
    price: 1800,
    currency: 'USD',
    imageUrl: '/images/marketplace/macbook.jpg',
    category: 'Electronics',
    condition: 'Like New',
    location: 'Berkeley, CA',
    sellerId: 'user1',
    sellerName: 'John Doe',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Wooden Dining Table',
    description: descriptions.getRandomDescription('long'),
    price: 350,
    currency: 'USD',
    imageUrl: '/images/marketplace/dining-table.jpg',
    category: 'Furniture',
    condition: 'Good',
    location: 'Oakland, CA',
    sellerId: 'user2',
    sellerName: 'Jane Smith',
    createdAt: '2023-05-10T14:20:00Z',
    updatedAt: '2023-05-10T14:20:00Z',
  },
  {
    id: '3',
    title: 'Nike Air Jordan 1',
    description: descriptions.getRandomDescription('long'),
    price: 220,
    currency: 'USD',
    imageUrl: '/images/marketplace/air-jordan.jpg',
    category: 'Clothing',
    condition: 'Like New',
    location: 'San Francisco, CA',
    sellerId: 'user3',
    sellerName: 'Mike Johnson',
    createdAt: '2023-05-12T09:15:00Z',
    updatedAt: '2023-05-12T09:15:00Z',
  },
  {
    id: '4',
    title: 'iPhone 13 Pro',
    description: descriptions.getRandomDescription('long'),
    price: 750,
    currency: 'USD',
    imageUrl: '/images/marketplace/iphone.jpg',
    category: 'Electronics',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user4',
    sellerName: 'Sarah Williams',
    createdAt: '2023-05-14T16:45:00Z',
    updatedAt: '2023-05-14T16:45:00Z',
  },
  {
    id: '5',
    title: 'Calculus Textbook',
    description: descriptions.getRandomDescription('long'),
    price: 45,
    currency: 'USD',
    imageUrl: '/images/marketplace/textbook.jpg',
    category: 'Books',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user5',
    sellerName: 'Alex Chen',
    createdAt: '2023-05-08T11:30:00Z',
    updatedAt: '2023-05-08T11:30:00Z',
  },
  {
    id: '6',
    title: 'Mountain Bike',
    description: descriptions.getRandomDescription('long'),
    price: 650,
    currency: 'USD',
    imageUrl: '/images/marketplace/bike.jpg',
    category: 'Sports',
    condition: 'Good',
    location: 'Oakland, CA',
    sellerId: 'user6',
    sellerName: 'David Brown',
    createdAt: '2023-05-11T13:20:00Z',
    updatedAt: '2023-05-11T13:20:00Z',
  },
  {
    id: '7',
    title: 'IKEA MALM Dresser',
    description: descriptions.getRandomDescription('long'),
    price: 120,
    currency: 'USD',
    imageUrl: '/images/marketplace/dresser.jpg',
    category: 'Furniture',
    condition: 'Good',
    location: 'San Francisco, CA',
    sellerId: 'user7',
    sellerName: 'Emily Davis',
    createdAt: '2023-05-09T10:10:00Z',
    updatedAt: '2023-05-09T10:10:00Z',
  },
  {
    id: '8',
    title: 'Sony PlayStation 5',
    description: descriptions.getRandomDescription('long'),
    price: 450,
    currency: 'USD',
    imageUrl: '/images/marketplace/ps5.jpg',
    category: 'Electronics',
    condition: 'Like New',
    location: 'Berkeley, CA',
    sellerId: 'user8',
    sellerName: 'Tom Wilson',
    createdAt: '2023-05-13T15:30:00Z',
    updatedAt: '2023-05-13T15:30:00Z',
  },
  {
    id: '9',
    title: 'Dell 27" 4K Monitor',
    description: descriptions.getRandomDescription('long'),
    price: 320,
    currency: 'USD',
    imageUrl: '/images/marketplace/monitor.jpg',
    category: 'Electronics',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user1',
    sellerName: 'John Doe',
    createdAt: '2023-05-16T09:45:00Z',
    updatedAt: '2023-05-16T09:45:00Z',
  },
  {
    id: '10',
    title: 'Sony WH-1000XM4 Headphones',
    description: descriptions.getRandomDescription('long'),
    price: 180,
    currency: 'USD',
    imageUrl: '/images/marketplace/headphones.jpg',
    category: 'Electronics',
    condition: 'Good',
    location: 'Oakland, CA',
    sellerId: 'user3',
    sellerName: 'Mike Johnson',
    createdAt: '2023-05-17T14:20:00Z',
    updatedAt: '2023-05-17T14:20:00Z',
  },
  {
    id: '11',
    title: 'Canon EOS R6 Camera',
    description: descriptions.getRandomDescription('long'),
    price: 2200,
    currency: 'USD',
    imageUrl: '/images/marketplace/camera.jpg',
    category: 'Photography',
    condition: 'Like New',
    location: 'San Francisco, CA',
    sellerId: 'user5',
    sellerName: 'Alex Chen',
    createdAt: '2023-05-18T11:15:00Z',
    updatedAt: '2023-05-18T11:15:00Z',
  },
  {
    id: '12',
    title: 'Apple Watch Series 7',
    description: descriptions.getRandomDescription('long'),
    price: 300,
    currency: 'USD',
    imageUrl: '/images/marketplace/watch.jpg',
    category: 'Electronics',
    condition: 'Like New',
    location: 'Berkeley, CA',
    sellerId: 'user2',
    sellerName: 'Jane Smith',
    createdAt: '2023-05-19T16:30:00Z',
    updatedAt: '2023-05-19T16:30:00Z',
  },
  {
    id: '13',
    title: 'Fender Stratocaster Electric Guitar',
    description: descriptions.getRandomDescription('long'),
    price: 1400,
    currency: 'USD',
    imageUrl: '/images/marketplace/guitar.jpg',
    category: 'Audio',
    condition: 'Like New',
    location: 'Oakland, CA',
    sellerId: 'user6',
    sellerName: 'David Brown',
    createdAt: '2023-05-20T10:45:00Z',
    updatedAt: '2023-05-20T10:45:00Z',
  },
  {
    id: '14',
    title: 'Standing Desk',
    description: descriptions.getRandomDescription('long'),
    price: 400,
    currency: 'USD',
    imageUrl: '/images/marketplace/desk.jpg',
    category: 'Furniture',
    condition: 'Good',
    location: 'San Francisco, CA',
    sellerId: 'user4',
    sellerName: 'Sarah Williams',
    createdAt: '2023-05-21T13:20:00Z',
    updatedAt: '2023-05-21T13:20:00Z',
  },
  {
    id: '15',
    title: 'Herman Miller Aeron Chair',
    description: descriptions.getRandomDescription('long'),
    price: 550,
    currency: 'USD',
    imageUrl: '/images/marketplace/chair.jpg',
    category: 'Furniture',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user7',
    sellerName: 'Emily Davis',
    createdAt: '2023-05-22T09:10:00Z',
    updatedAt: '2023-05-22T09:10:00Z',
  },
  {
    id: '16',
    title: 'Modern Floor Lamp',
    description: descriptions.getRandomDescription('long'),
    price: 120,
    currency: 'USD',
    imageUrl: '/images/marketplace/lamp.jpg',
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Oakland, CA',
    sellerId: 'user8',
    sellerName: 'Tom Wilson',
    createdAt: '2023-05-23T15:40:00Z',
    updatedAt: '2023-05-23T15:40:00Z',
  },
  {
    id: '17',
    title: 'North Face Backpack',
    description: descriptions.getRandomDescription('long'),
    price: 65,
    currency: 'USD',
    imageUrl: '/images/marketplace/backpack.jpg',
    category: 'Accessories',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user1',
    sellerName: 'John Doe',
    createdAt: '2023-05-24T11:25:00Z',
    updatedAt: '2023-05-24T11:25:00Z',
  },
  {
    id: '18',
    title: 'Adidas Ultraboost Sneakers',
    description: descriptions.getRandomDescription('long'),
    price: 90,
    currency: 'USD',
    imageUrl: '/images/marketplace/sneakers.jpg',
    category: 'Clothing',
    condition: 'Good',
    location: 'San Francisco, CA',
    sellerId: 'user3',
    sellerName: 'Mike Johnson',
    createdAt: '2023-05-25T14:15:00Z',
    updatedAt: '2023-05-25T14:15:00Z',
  },
  {
    id: '19',
    title: 'Patagonia Down Jacket',
    description: descriptions.getRandomDescription('long'),
    price: 150,
    currency: 'USD',
    imageUrl: '/images/marketplace/jacket.jpg',
    category: 'Clothing',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user5',
    sellerName: 'Alex Chen',
    createdAt: '2023-05-26T10:30:00Z',
    updatedAt: '2023-05-26T10:30:00Z',
  },
  {
    id: '20',
    title: 'Ray-Ban Sunglasses',
    description: descriptions.getRandomDescription('long'),
    price: 95,
    currency: 'USD',
    imageUrl: '/images/marketplace/sunglasses.jpg',
    category: 'Accessories',
    condition: 'Like New',
    location: 'Oakland, CA',
    sellerId: 'user2',
    sellerName: 'Jane Smith',
    createdAt: '2023-05-27T13:45:00Z',
    updatedAt: '2023-05-27T13:45:00Z',
  },
  {
    id: '21',
    title: 'Breville Espresso Machine',
    description: descriptions.getRandomDescription('long'),
    price: 450,
    currency: 'USD',
    imageUrl: '/images/marketplace/coffee-maker.jpg',
    category: 'Kitchen',
    condition: 'Good',
    location: 'San Francisco, CA',
    sellerId: 'user6',
    sellerName: 'David Brown',
    createdAt: '2023-05-28T09:20:00Z',
    updatedAt: '2023-05-28T09:20:00Z',
  },
  {
    id: '22',
    title: 'Vitamix Blender',
    description: descriptions.getRandomDescription('long'),
    price: 280,
    currency: 'USD',
    imageUrl: '/images/marketplace/blender.jpg',
    category: 'Kitchen',
    condition: 'Good',
    location: 'Berkeley, CA',
    sellerId: 'user4',
    sellerName: 'Sarah Williams',
    createdAt: '2023-05-29T15:10:00Z',
    updatedAt: '2023-05-29T15:10:00Z',
  },
  {
    id: '23',
    title: 'Sonos One Smart Speaker',
    description: descriptions.getRandomDescription('long'),
    price: 160,
    currency: 'USD',
    imageUrl: '/images/marketplace/speaker.jpg',
    category: 'Audio',
    condition: 'Like New',
    location: 'Oakland, CA',
    sellerId: 'user7',
    sellerName: 'Emily Davis',
    createdAt: '2023-05-30T11:35:00Z',
    updatedAt: '2023-05-30T11:35:00Z',
  },
  {
    id: '24',
    title: 'Logitech MX Keys Keyboard',
    description: descriptions.getRandomDescription('long'),
    price: 85,
    currency: 'USD',
    imageUrl: '/images/marketplace/keyboard.jpg',
    category: 'Electronics',
    condition: 'Like New',
    location: 'Berkeley, CA',
    sellerId: 'user8',
    sellerName: 'Tom Wilson',
    createdAt: '2023-05-31T14:25:00Z',
    updatedAt: '2023-05-31T14:25:00Z',
  },
]; 