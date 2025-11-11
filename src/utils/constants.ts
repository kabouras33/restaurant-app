import axios from 'axios';

export const API_BASE_URL = 'https://api.yourrestaurantapp.com';
export const STRIPE_PUBLIC_KEY = 'pk_test_1234567890abcdef';
export const AUTH_TOKEN_KEY = 'authToken';

export const fetchConfig = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching configuration:', error);
    throw new Error('Failed to fetch configuration');
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      console.error('No response received:', error.request);
      return 'No response from server';
    }
  }
  console.error('Unexpected error:', error);
  return 'An unexpected error occurred';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateForm = (fields: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!validateEmail(fields.email)) {
    errors.email = 'Invalid email address';
  }
  if (!validatePassword(fields.password)) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const RESERVATION_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};

export const INVENTORY_CATEGORIES = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
];

export const NOTIFICATION_TYPES = {
  EMAIL: 'Email',
  SMS: 'SMS',
  PUSH: 'Push Notification',
};

export const REPORT_TYPES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
};

export const DEFAULT_PAGE_SIZE = 10;