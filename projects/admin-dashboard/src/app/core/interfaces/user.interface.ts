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

export interface UserKYC {
  id: string;
  userId: string;
  internationalPassport: any;  // Image file
  russianPassport?: any;        // Image file
  schoolID: any;               // Image file
  selfie: any;                 // Image file
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;    // Optional, needed only if rejected
  user: User;
  step: KYCStep;
  documentsInReviewEmailSent: boolean;
  documentsVerifiedEmailSent: boolean;
  documentsRejectedEmailSent: boolean;
}

export enum KYCStep {
  START = 'start',
  SUBMIT_SELFIE = 'submit_selfie',
  SUBMIT_INTERNATIONAL_PASSPORT = 'submit_international_passport',
  SUBMIT_RUSSIAN_PASSPORT = 'submit_russian_passport',
  SUBMIT_SCHOOL_ID = 'submit_school_id',
  REVIEW = 'review',
  COMPLETE = 'complete',
}
