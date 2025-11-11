import React from 'react';
import { AxiosError } from 'axios';

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Restaurant-related types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  numberOfGuests: number;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory-related types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError extends AxiosError {
  response: {
    data: {
      message: string;
    };
  };
}

// Form validation types
export interface FormValidationErrors {
  [key: string]: string;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'canceled';
  startDate: string;
  endDate: string;
}

// Payment types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method: 'credit_card' | 'paypal' | 'stripe';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId: string;
}

export interface PaymentError {
  code: string;
  message: string;
}

export default {};