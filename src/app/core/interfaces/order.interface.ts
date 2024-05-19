import { User } from "./user.interface";

export enum OrderStatus {
  Pending = 'Pending',           // Order is created but not yet accepted by any courier
  Accepted = 'Accepted',         // Order is accepted by a courier
  InProgress = 'InProgress',     // Courier is currently delivering the order
  Delivered = 'Delivered',       // Order has been successfully delivered
  Cancelled = 'Cancelled',       // Order has been cancelled
  Failed = 'Failed'              // Order delivery failed
}

export enum ItemType {
  gadget = "gadget",
  clothing = "clothing",
  food = "food",
  furniture = "furniture",
  book = "book",
  appliance = "appliance",
  beauty = "beauty",
  sport = "sport",
  tool = "tool",
  electronics = "electronics",
  jewelry = "jewelry",
  other = "other"
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  itemName: string;             // Name of the item being delivered
  recipient: User;              // Details of the recipient
  sender: User;                 // Details of the sender (could be optional if same as recipient)
  pickupAddress: Address;       // Pickup location
  deliveryAddress: Address;     // Delivery location
  status: OrderStatus;          // Current status of the order
  price: number;                // Cost of the delivery
  createdAt: Date | string;              // Timestamp when the order was created
  acceptedAt?: Date | string;            // Timestamp when the order was accepted by a courier
  deliveredAt?: Date | string;           // Timestamp when the order was delivered
  cancelledAt?: Date | string;           // Timestamp when the order was cancelled
  estimatedDeliveryTime?: Date | string; // Estimated delivery time
  notes?: string;               // Additional notes or instructions for the delivery
  trackingNumber?: string;      // Tracking number for the order
  deliveryMode?: 'feet' | 'bike' | 'car' | 'van' | 'truck'; // Mode of delivery
  currency?: string;            // Currency of the price
  itemType?: ItemType;
}

export type Orders = Order[];
