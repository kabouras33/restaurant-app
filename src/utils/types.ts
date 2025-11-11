import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface RouteProps {
  children: ReactNode;
  path: string;
  exact?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethodId: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface LoadingState {
  loading: boolean;
  error?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error?: string;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}