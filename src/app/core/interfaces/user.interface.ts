export interface User {
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
