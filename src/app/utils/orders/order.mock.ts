import * as Chance from 'chance';
import { Order, OrderStatus, Address } from '../../core/interfaces/order.interface';
import { User } from '../../core/interfaces/user.interface';
const chance = new Chance();

const generateMockUser = (): User => ({
  id: chance.guid(),
  firstName: chance.first(),
  middleName: chance.string({ length: 5, alpha: true }),
  lastName: chance.last(),
  email: chance.email(),
  password: chance.string({ length: 8 }),
  phone: chance.phone(),
  profilePicture: chance.avatar(),
  addressStreet: chance.address(),
  addressCity: chance.city(),
  addressState: chance.state(),
  addressPostalCode: chance.zip(),
  addressCountry: 'Russia',
  role: chance.pickone(['Customer', 'Courier']),
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
  street: chance.address(),
  city: chance.city(),
  state: chance.state(),
  postalCode: chance.zip(),
  country: 'Russia',
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
});

// Generate a list of mock orders
const generateMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }, generateMockOrder);
};

export const mockOrders = generateMockOrders(10);
