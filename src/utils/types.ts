import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method: 'credit_card' | 'paypal' | 'stripe';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push';
  message: string;
  recipient: string;
  status: 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  data: any; // Use specific types based on report structure
  generatedAt: string;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface ApiError {
  message: string;
  code: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean;
}