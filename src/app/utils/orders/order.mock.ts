import * as Chance from 'chance';
import { Order, OrderStatus, Address, ItemType, Orders, Chat, LocationType } from '../../core/interfaces/order.interface';
import { Courier, User } from '../../core/interfaces/user.interface';
const chance = new Chance();

const generateMockUser = (): User => ({
  id: chance.guid(),
  firstName: chance.first(),
  middleName: chance.string({ length: 5, alpha: true }),
  lastName: chance.last(),
  email: chance.email(),
  password: chance.string({ length: 8 }),
  phone: chance.phone(),
  profilePicture: chance.avatar({
    protocol: 'https',
    fileExtension: 'svg',
    email: chance.email(),
  }),
  addressStreet: chance.address(),
  addressCity: chance.city(),
  addressState: chance.state(),
  addressPostalCode: chance.zip(),
  addressCountry: 'Russia',
  role: chance.pickone(['customer', 'courier']),
  createdAt: chance.date({ month: 3, year: 2024 }).toString(),
  updatedAt: chance.date({ month: 3, year: 2024 }).toString(),
  lastLogin: chance.date({ month: 3, year: 2024 }).toString(),
  token: chance.guid(),
  settings: {
    language: 'en',
    notificationsEmail: chance.bool(),
    notificationsSms: chance.bool(),
    securityTwoFactorAuth: chance.bool(),
    verified: chance.bool(),
  },
});

const generateMockAddress = (): Address => ({
  address: chance.address(),
  city: chance.city(),
  state: chance.state(),
  postalCode: chance.zip(),
  country: 'Russia',
  type: chance.pickone(['pickup', 'delivery']),
  locationType: chance.pickone(Object.values(LocationType)) as LocationType,
  coordinates: [0, 0],
});


const generateMockOrder = (): Order => ({
  itemName: chance.sentence({ words: 3 }),
  id: chance.guid(),
  recipient: generateMockUser(),
  sender: generateMockUser(),
  pickupAddress: generateMockAddress(),
  deliveryAddress: generateMockAddress(),
  status: chance.pickone(Object.values(OrderStatus)),
  price: chance.integer({ min: 100, max: 1000 }),
  createdAt: chance.date({ month: new Date().getMonth(), year: 2024 }).toString(),
  acceptedAt: chance.bool() ? chance.date({ month: new Date().getMonth(), year: 2024 }).toString() : undefined,
  deliveredAt: chance.bool() ? chance.date({ month: new Date().getMonth(), year: 2024 }).toString() : undefined,
  cancelledAt: chance.bool() ? chance.date({ month: new Date().getMonth(), year: 2024 }).toString() : undefined,
  estimatedDeliveryTime: chance.bool() ? chance.date({ month: new Date().getMonth(), year: 2024 }).toString() : undefined,
  notes: chance.sentence(),
  trackingNumber: chance.guid(),
  deliveryMode: 'feet',
  currency: 'RUB',
  itemType: chance.pickone(Object.values(ItemType)) as ItemType,
  packageSize: chance.pickone(['small', 'medium', 'large']),
  packageWeight: chance.floating({ min: 0.1, max: 50 }),
  distance: chance.floating({ min: 1, max: 100 }),
});

const generateMockCourier = (): Courier => ({
  ...generateMockUser(),
  orders: [],
  vehicleType: chance.pickone(['bike', 'car', 'van']),
  licensePlate: chance.string({ length: 7, alpha: true, numeric: true }).toUpperCase(),
  ratings: chance.floating({ min: 0, max: 5 }),
  completedDeliveries: chance.integer({ min: 0, max: 100 }),
  averageDeliveryTime: `00:${chance.integer({ min: 20, max: 90 })}:00`,
  availabilityStatus: chance.pickone(['available', 'unavailable', 'busy']),
});

// Generate a list of mock orders
const generateMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }, generateMockOrder);
};
const generateMockCouriers = (count: number): Courier[] => {
  return Array.from({ length: count }, generateMockCourier);
};

// Generate Chat messages
const generateMockMessage = (user: User, courier: Courier): Chat => ({
  id: chance.guid(),
  orderId: chance.guid(),
  messages: Array.from({ length: chance.integer({ min: 1, max: 10 }) }, () => ({
    id: chance.guid(),
    sender: chance.pickone([user, courier]),
    content: chance.sentence(),
    timestamp: chance.date({ month: new Date().getMonth(), year: 2024 }).toString(),
  })),
});

// Function to assign non-pending orders to couriers
const assignOrdersToCouriers = (orders: Orders, couriers: Courier[]): void => {
  orders.forEach(order => {
    // Assign if order is not Pending and doesn't have a courier assigned
    if (order.status !== OrderStatus.Pending) {
      const availableCouriers = couriers.filter(courier => courier.availabilityStatus === 'available');
      if (availableCouriers.length > 0) {
        const selectedCourier = availableCouriers[chance.integer({ min: 0, max: availableCouriers.length - 1 })];
        order.courier = selectedCourier;
        order.chat = generateMockMessage(order.sender, selectedCourier);
        selectedCourier.orders.push({ orderId: order.id });
        selectedCourier.availabilityStatus = 'busy'; // Update status to busy
      }
    }

    if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Cancelled || order.status === OrderStatus.Failed) {
      if (order.courier) {
        order.courier.availabilityStatus = 'available'; // Update status to available
      }
    }
  });
};

const mockOrders = generateMockOrders(30);
const mockCouriers = generateMockCouriers(5);
assignOrdersToCouriers(mockOrders, mockCouriers);

// assign orders to user in local storage
const user: User = JSON.parse(localStorage.getItem('user') as string);
if (user && user.role === 'customer') {
  user.orders = mockOrders;
};

export const mockData = {
  orders: mockOrders,
  couriers: mockCouriers,
  user: user,
};


// Location
// Generate mock locations data for mock API requests

/**
 * Generate a mock location object
 * @returns {Address} - A mock location object
 */
const generateMockLocation = (): Address => ({
  address: chance.address(),
  city: chance.city(),
  state: chance.state(),
  postalCode: chance.zip(),
  country: 'Russia',
  type: chance.pickone(['pickup', 'delivery']),
  locationType: chance.pickone(Object.values(LocationType)) as LocationType,
  coordinates: [0, 0],
});

/**
 * Generate a list of mock locations
 * @param {number} count - The number of locations to generate
 * @returns {Address[]} - A list of mock locations
 */
const generateMockLocations = (count: number): Address[] => {
  return Array.from({ length: count }, generateMockLocation);
};

export const mockLocations = generateMockLocations(10);

export const mockLocation = generateMockLocation();

// mock a search query API request, return a list of locations
// simulate a delay of 1 second
export const searchLocationsMockAPI = (query: string): Promise<Address[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockLocations.filter(location => location.address.toLowerCase().includes(query.toLowerCase())));
    }, 1000);
  });
};
