import { Orders, OrderStatus } from "./order.interface"

export interface User {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  password: string
  phone: string
  profilePicture: any
  addressStreet: string
  addressCity: string
  addressState: string
  floor: string
  apartment_number: string
  zip_code: string
  addressPostalCode: string
  addressCountry: string
  role: string
  createdAt: string
  updatedAt: string
  lastLogin: string
  token: string
  settings: Settings
  orders?: Orders
  warnings?: string[];
}

export interface Order {
  id: string;
  date: Date;
  status: string;
  details: {
    // Details of the order
  };
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
}

export interface Settings {
  language: string
  notificationsEmail: boolean
  notificationsSms: boolean
  securityTwoFactorAuth: boolean
  verified: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UserAccount {
  profile: User;
  orders: Order[];
  payments: Payment[];
  settings: Settings;
}

export enum UserRole {
  CUSTOMER = 'customer',
  COURIER = 'courier',
}

export interface Courier {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  password: string
  phone: string
  profilePicture: any
  addressStreet: any
  addressCity: any
  addressState: any
  addressPostalCode: any
  addressCountry: any
  role: string
  createdAt: string
  updatedAt: string
  lastLogin: string
  token: string
  settings: Settings
  orders: Delivery[];
  vehicleType: string; // e.g., bike, car, van
  licensePlate: string;
  ratings: number;
  completedDeliveries: number;
  averageDeliveryTime: string; // e.g., "00:45:00" for 45 minutes
  availabilityStatus: 'available' | 'unavailable' | 'busy';
}

export interface Delivery {
  orderId: string;
}
