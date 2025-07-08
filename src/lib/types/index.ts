import type { FieldConfig, FormConfig } from "./dynamicForm";


// Booking types
export interface Booking {
  id: string;
  userId: string;
  userName: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  createdAt: Date;
}

// Invoice types
export interface Invoice {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  hotelId: string;
  hotelName: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
}

// Hotel types
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  rating: number;
  images: string[];
  amenities: string[];
  status: "active" | "inactive";
  ownerId: string;
  createdAt: Date;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "hotel_admin" | "staff" | "customer";
  avatar?: string;
  createdAt: Date;
  status: "active" | "inactive";
}

export type {
    FormConfig,
    FieldConfig,
    Booking,
    Invoice,
    Hotel,
    User
}